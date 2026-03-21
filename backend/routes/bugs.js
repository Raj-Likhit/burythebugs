const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const bugsPath = path.join(__dirname, '..', 'data', 'bugs.json');

function loadBugs() {
  const data = fs.readFileSync(bugsPath, 'utf-8');
  return JSON.parse(data);
}

// GET /api/bug/random?language=python&exclude=1,2,3
router.get('/random', (req, res) => {
  try {
    const { language, exclude } = req.query;

    if (!language) {
      return res.status(400).json({ error: 'Language parameter is required' });
    }

    const validLanguages = ['python', 'c', 'cpp', 'java'];
    if (!validLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ error: `Invalid language. Must be one of: ${validLanguages.join(', ')}` });
    }

    const bugs = loadBugs();
    let filtered = bugs.filter(b => b.language === language.toLowerCase());

    // Exclude already-played bug IDs
    if (exclude) {
      const excludeIds = exclude.split(',').map(Number).filter(n => !isNaN(n));
      filtered = filtered.filter(b => !excludeIds.includes(b.id));
    }

    if (filtered.length === 0) {
      return res.status(404).json({
        error: `No more bugs available for ${language}. You've squashed them all!`,
        exhausted: true
      });
    }

    const randomBug = filtered[Math.floor(Math.random() * filtered.length)];

    // Return bug without the correct_code (don't reveal the answer)
    const { correct_code, ...safeBug } = randomBug;
    res.json(safeBug);
  } catch (err) {
    console.error('[BUGS]', err.message);
    res.status(500).json({ error: 'Failed to load bugs' });
  }
});

// GET /api/bug/count
router.get('/count', (req, res) => {
  try {
    const bugs = loadBugs();
    const counts = {
      total: bugs.length,
      python: bugs.filter(b => b.language === 'python').length,
      c: bugs.filter(b => b.language === 'c').length,
      cpp: bugs.filter(b => b.language === 'cpp').length,
      java: bugs.filter(b => b.language === 'java').length
    };
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to count bugs' });
  }
});

module.exports = router;
