import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Ensure .env is loaded
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const JWT_SECRET = process.env.JWT_SECRET || 'kigali_pulse_fallback_secret_123';
const INITIAL_ADMIN_EMAIL = (process.env.INITIAL_ADMIN_EMAIL || 'emmanuelmuke58@gmail.com').toLowerCase().trim();
const INITIAL_ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD || 'KigaliPulse2026!Admin';

interface User {
  uid: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
  avatar?: string;
}

// Simple JSON store logic
function loadUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (e) {
    console.error('Backend: Error loading users:', e);
    return [];
  }
}

function saveUsers(users: User[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Backend: Error saving users:', e);
  }
}

async function initSuperAdmin() {
  console.log('Backend: Checking Super Admin status...');
  const users = loadUsers();
  const superAdmin = users.find(u => u.uid === 'super-admin-fixed');

  if (!superAdmin) {
    console.log('Backend: Creating initial Super Admin account...');
    const hashedPassword = await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 12);
    
    const newAdmin: User = {
      uid: 'super-admin-fixed',
      email: INITIAL_ADMIN_EMAIL,
      passwordHash: hashedPassword,
      name: 'Super Admin',
      role: 'SuperAdmin',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    };
    
    users.push(newAdmin);
    saveUsers(users);
    console.log(`Backend: Super Admin initialized [${INITIAL_ADMIN_EMAIL}]`);
  } else {
    console.log('Backend: Super Admin already verified.');
  }
}

async function startServer() {
  const appExpress = express();
  appExpress.use(express.json());
  appExpress.use(cookieParser());

  // Initialize Super Admin
  await initSuperAdmin();

  // AUTH ROUTES
  appExpress.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const cleanEmail = email.toLowerCase().trim();

    try {
      const users = loadUsers();
      const user = users.find(u => u.email === cleanEmail);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials or unauthorized access.' });
      }

      if (user.status !== 'Active') {
        return res.status(403).json({ error: 'Account restricted.' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials or unauthorized access.' });
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      saveUsers(users);

      const token = jwt.sign(
        { uid: user.uid, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000
      });

      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error('Backend: Auth Logic Error:', error.message);
      res.status(500).json({ error: 'An internal error occurred. Please retry.' });
    }
  });

  appExpress.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  appExpress.get('/api/auth/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const users = loadUsers();
      const user = users.find(u => u.uid === decoded.uid);

      if (!user) {
        res.clearCookie('token');
        return res.status(401).json({ error: 'Session invalid' });
      }

      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      res.clearCookie('token');
      res.status(401).json({ error: 'Session expired' });
    }
  });

  appExpress.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'All fields required.' });

    const cleanEmail = email.toLowerCase().trim();
    try {
      const users = loadUsers();
      if (users.find(u => u.email === cleanEmail)) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser: User = {
        uid: `user-${Date.now()}`,
        email: cleanEmail,
        passwordHash: hashedPassword,
        name,
        role: 'Attendee',
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      users.push(newUser);
      saveUsers(users);

      const token = jwt.sign(
        { uid: newUser.uid, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000
      });

      const { passwordHash, ...safeUser } = newUser;
      res.json({ user: safeUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // EVENTS LOGIC
  const EVENTS_FILE = path.resolve(DATA_DIR, 'events.json');
  function loadEvents() {
    if (!fs.existsSync(EVENTS_FILE)) return [];
    try {
      return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  function saveEvents(events: any[]) {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  }

  appExpress.get('/api/events', (req, res) => {
    const events = loadEvents();
    // Return all for now, but usually you'd filter by 'Published' status for public
    res.json(events);
  });

  appExpress.post('/api/events', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const events = loadEvents();
      const newEvent = {
        ...req.body,
        id: `evt-${Date.now()}`,
        userId: decoded.uid, // Track ownership
        createdAt: new Date().toISOString(),
        status: 'Pending' // Default to pending for moderation
      };
      events.push(newEvent);
      saveEvents(events);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(401).json({ error: 'Session invalid' });
    }
  });

  appExpress.get('/api/events/my', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const events = loadEvents();
      const myEvents = events.filter((e: any) => e.userId === decoded.uid || decoded.role === 'SuperAdmin');
      res.json(myEvents);
    } catch (error) {
      res.status(401).json({ error: 'Session invalid' });
    }
  });

  appExpress.delete('/api/events/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const events = loadEvents();
      const eventIndex = events.findIndex((e: any) => e.id === req.params.id);
      
      if (eventIndex === -1) return res.status(404).json({ error: 'Event not found' });
      
      const event = events[eventIndex];
      // Ownership check
      if (event.userId !== decoded.uid && decoded.role !== 'SuperAdmin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      events.splice(eventIndex, 1);
      saveEvents(events);
      res.json({ success: true });
    } catch (error) {
      res.status(401).json({ error: 'Session invalid' });
    }
  });

  appExpress.put('/api/events/:id', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const events = loadEvents();
      const eventIndex = events.findIndex((e: any) => e.id === req.params.id);

      if (eventIndex === -1) return res.status(404).json({ error: 'Event not found' });

      const event = events[eventIndex];
      // Ownership check (only owner or Admin can update)
      if (event.userId !== decoded.uid && decoded.role !== 'SuperAdmin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const updatedEvent = { ...event, ...req.body, updatedAt: new Date().toISOString() };
      events[eventIndex] = updatedEvent;
      saveEvents(events);
      res.json(updatedEvent);
    } catch (error) {
      res.status(401).json({ error: 'Session invalid' });
    }
  });

  // VITE MIDDLEWARE
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  appExpress.use(vite.middlewares);

  appExpress.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  const port = process.env.PORT || 3000;
  appExpress.listen(port, () => {
    console.log(`Backend: Server listening on http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Backend: CRITICAL STARTUP ERROR:', err);
});
