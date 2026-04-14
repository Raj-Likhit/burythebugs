const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');

let clients = [];

const broadcastLeaderboard = async () => {
  if (clients.length === 0) return;
  try {
    const scores = await db.getScores();
    const top20 = scores.sort((a, b) => b.score - a.score).slice(0, 20);
    const data = JSON.stringify(top20);
    clients.forEach(client => {
      // Ensure the 'write' behaves asynchronously enough if needed, but synchronous is fine for SSE
      client.write(`data: ${data}\n\n`);
    });
  } catch (err) {
    console.error('[SSE ERROR]', err.message);
  }
};

// SSE endpoint
router.get('/stream', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  clients.push(res);

  // Send initial data immediately
  try {
    const scores = await db.getScores();
    const top20 = scores.sort((a, b) => b.score - a.score).slice(0, 20);
    res.write(`data: ${JSON.stringify(top20)}\n\n`);
  } catch (err) {
    console.error(err);
  }

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// GET /api/leaderboard (fallback)
router.get('/', async (req, res) => {
  try {
    const scores = await db.getScores();
    const top20 = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    res.json(top20);
  } catch (err) {
    console.error('[LEADERBOARD]', err.message);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// POST /api/leaderboard
router.post('/', async (req, res) => {
  try {
    const { name, rollNo, language, totalScore } = req.body;
    
    if (!name || !rollNo || !language || totalScore === undefined) {
      return res.status(400).json({ error: 'Missing required payload for aggregate scoring.' });
    }
    
    const entry = {
      id: uuidv4(),
      name,
      rollNo,
      language,
      score: totalScore,
      timestamp: new Date().toISOString()
    };
    
    await db.addScore(entry);
    res.json({ success: true, entry });
    
    // Broadcast to SSE clients
    broadcastLeaderboard();
  } catch(err) {
    console.error('[LEADERBOARD POST]', err.message);
    res.status(500).json({ error: 'Failed to save aggregate score.' });
  }
});

module.exports = router;
