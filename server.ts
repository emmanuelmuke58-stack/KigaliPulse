import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post('/api/ai/suggest', async (req, res) => {
    const { mood, category, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are KigaliPulse AI, a local expert on Kigali, Rwanda. 
        A user is looking for event recommendations.
        Mood: ${mood}
        Preferred Category: ${category}
        Context: ${context || 'Just looking for something fun to do.'}
        
        Based on these inputs, suggest 2-3 types of experiences or specific events they might enjoy in Kigali. 
        Be enthusiastic and mention specific neighborhoods like Kimihurura, Kiyovu, or Nyamirambo if relevant.
        Keep it concise and formatted for a mobile app.`,
        config: {
          systemInstruction: "You are a helpful, culturally-aware assistant for the KigaliPulse app.",
        }
      });

      res.json({ suggestion: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate suggestion' });
    }
  });

  // Vite Integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
