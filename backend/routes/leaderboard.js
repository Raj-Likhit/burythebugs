const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const scoresPath = path.join(__dirname, '..', 'data', 'scores.json');

function loadScores() {
  try {
    return JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));
  } catch {
    return [];
  }
}

// GET /api/leaderboard
router.get('/', (req, res) => {
  try {
    const scores = loadScores();
    const top20 = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    res.json(top20);
  } catch (err) {
    console.error('[LEADERBOARD]', err.message);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

module.exports = router;
