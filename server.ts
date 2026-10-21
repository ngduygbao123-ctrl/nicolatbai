import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleChatRequest } from './api/chat-handler.ts';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API route for NicoLatBai Milk Tea CSKH AI
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const reply = await handleChatRequest(messages || []);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Download web archive
app.get('/download-web', (req, res) => {
  const zipPath = path.resolve(__dirname, 'trasua-nicolatbai-web.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="trasua-nicolatbai-web.zip"');
    fs.createReadStream(zipPath).pipe(res);
  } else {
    res.status(404).send('Zip file not found');
  }
});

// Serve frontend build static files
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`NicoLatBai Milk Tea server listening on port ${port}`);
});
