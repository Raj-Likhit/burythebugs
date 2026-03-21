const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const bugsPath = path.join(__dirname, '..', 'data', 'bugs.json');
const OLLAMA_URL = 'http://localhost:11434/api/generate';

function loadBugs() {
  return JSON.parse(fs.readFileSync(bugsPath, 'utf-8'));
}

// POST /api/hint
router.post('/', async (req, res) => {
  try {
    const { bugId, currentCode, language } = req.body;

    if (!bugId || !currentCode || !language) {
      return res.status(400).json({ error: 'Missing required fields: bugId, currentCode, language' });
    }

    const bugs = loadBugs();
    const bug = bugs.find(b => b.id === bugId);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    const prompt = `The following code has exactly one bug. Give a helpful hint that guides the developer in the right direction without revealing the answer or showing correct code. Keep the hint under 3 sentences.\nLanguage: ${language}\nBuggy code:\n${bug.buggy_code}\nCurrent attempt:\n${currentCode}`;

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-coder:6.7b',
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const data = await response.json();
      res.json({ hint: data.response || 'No hint generated. Try analyzing the logic manually.' });
    } catch (err) {
      console.error('[OLLAMA ERROR]', err.message);
      res.json({ hint: 'Hint service unavailable. Try analyzing the logic manually.' });
    }
  } catch (err) {
    console.error('[HINT]', err.message);
    res.status(500).json({ error: 'Hint generation failed' });
  }
});

module.exports = router;
