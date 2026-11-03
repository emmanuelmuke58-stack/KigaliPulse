import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Ensure .env is loaded
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, 'data');
const EVENTS_FILE = path.resolve(DATA_DIR, 'events.json');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'kigali-pulse-secret-key-12345';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers for data persistence
function loadData(file: string) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return [];
  }
}

function saveData(file: string, data: any[]) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Middleware to verify JWT Token
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const users = loadData(USERS_FILE);
    const user = users.find((u: any) => u.uid === decoded.uid);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Backend: Auth Error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

async function startServer() {
  const appExpress = express();
  appExpress.use(express.json());
  appExpress.use(cookieParser());

  // AUTH ROUTES
  appExpress.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    const users = loadData(USERS_FILE);

    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (users.find((u: any) => u.phone === phone)) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;
    const uid = `user-${Date.now()}`;
    
    const newUser = {
      uid,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: fullName,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      role: email === 'emmanuelmuke58@gmail.com' ? 'SuperAdmin' : 'Standard User',
      preferredCategories: [],
      preferredNeighborhoods: [],
      savedEventIds: [],
      followedOrganizerIds: [],
      notifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveData(USERS_FILE, users);

    const token = jwt.sign({ uid: newUser.uid, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user: userWithoutPassword, token });
  });

  appExpress.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const users = loadData(USERS_FILE);
    const user = users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: userWithoutPassword, token });
  });

  appExpress.get('/api/auth/me', authenticate, (req: any, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  appExpress.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  appExpress.post('/api/auth/reset-password', (req, res) => {
    const { email } = req.body;
    console.log(`Reset password requested for: ${email}`);
    // In a real app, send email here
    res.json({ success: true, message: 'If this email exists, a reset link has been sent.' });
  });

  appExpress.put('/api/auth/profile', authenticate, (req: any, res) => {
    const users = loadData(USERS_FILE);
    const index = users.findIndex((u: any) => u.uid === req.user.uid);
    
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    users[index] = { ...users[index], ...req.body, updatedAt: new Date().toISOString() };
    saveData(USERS_FILE, users);
    
    const { password, ...userWithoutPassword } = users[index];
    res.json({ user: userWithoutPassword });
  });

  // EVENTS API
  appExpress.get('/api/events', async (req: any, res) => {
    const events = loadData(EVENTS_FILE);
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    let isSuperAdmin = false;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const users = loadData(USERS_FILE);
        const user = users.find((u: any) => u.uid === decoded.uid);
        if (user) {
          userId = user.uid;
          isSuperAdmin = user.role === 'SuperAdmin';
        }
      } catch (e) {}
    }

    if (isSuperAdmin) {
      return res.json(events);
    }

    const visibleEvents = events.filter((e: any) => {
      const isPublished = ['Published', 'Featured', 'Sold Out', 'Completed'].includes(e.status);
      if (isPublished) return true;
      if (userId && e.organizerId === userId) return true;
      return false;
    });

    res.json(visibleEvents);
  });

  appExpress.post('/api/events', authenticate, (req: any, res) => {
    const events = loadData(EVENTS_FILE);
    const newEvent = {
      ...req.body,
      id: `evt-${Date.now()}`,
      organizerId: req.user.uid,
      createdAt: new Date().toISOString(),
      status: 'Published' 
    };
    events.push(newEvent);
    saveData(EVENTS_FILE, events);
    res.status(201).json(newEvent);
  });

  appExpress.get('/api/events/my', authenticate, (req: any, res) => {
    const events = loadData(EVENTS_FILE);
    const myEvents = events.filter((e: any) => e.organizerId === req.user.uid || req.user.role === 'SuperAdmin');
    res.json(myEvents);
  });

  appExpress.put('/api/events/:id', authenticate, (req: any, res) => {
    const events = loadData(EVENTS_FILE);
    const eventIndex = events.findIndex((e: any) => e.id === req.params.id);
    if (eventIndex === -1) return res.status(404).json({ error: 'Event not found' });

    const event = events[eventIndex];
    if (event.organizerId !== req.user.uid && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedEvent = { ...event, ...req.body, updatedAt: new Date().toISOString() };
    events[eventIndex] = updatedEvent;
    saveData(EVENTS_FILE, events);
    res.json(updatedEvent);
  });

  appExpress.delete('/api/events/:id', authenticate, (req: any, res) => {
    const events = loadData(EVENTS_FILE);
    const eventIndex = events.findIndex((e: any) => e.id === req.params.id);
    if (eventIndex === -1) return res.status(404).json({ error: 'Event not found' });

    const event = events[eventIndex];
    if (event.organizerId !== req.user.uid && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    events.splice(eventIndex, 1);
    saveData(EVENTS_FILE, events);
    res.json({ success: true });
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
