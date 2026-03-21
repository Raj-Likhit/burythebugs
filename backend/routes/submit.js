const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const bugsPath = path.join(__dirname, '..', 'data', 'bugs.json');
const scoresPath = path.join(__dirname, '..', 'data', 'scores.json');

const PISTON_URL = 'http://localhost:2000/api/v2/execute';

const LANGUAGE_MAP = {
  python: { language: 'python', version: '3.10.0' },
  c:      { language: 'c',      version: '10.2.0' },
  cpp:    { language: 'c++',    version: '10.2.0' },
  java:   { language: 'java',   version: '15.0.2' }
};

function loadBugs() {
  return JSON.parse(fs.readFileSync(bugsPath, 'utf-8'));
}

function loadScores() {
  try {
    return JSON.parse(fs.readFileSync(scoresPath, 'utf-8'));
  } catch {
    return [];
  }
}

function saveScores(scores) {
  fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2), 'utf-8');
}

// POST /api/submit
router.post('/', async (req, res) => {
  try {
    const { name, bugId, fixedCode, timeRemaining, language } = req.body;

    if (!name || !bugId || fixedCode === undefined || timeRemaining === undefined || !language) {
      return res.status(400).json({ error: 'Missing required fields: name, bugId, fixedCode, timeRemaining, language' });
    }

    const bugs = loadBugs();
    const bug = bugs.find(b => b.id === bugId);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // Build the full code: fixedCode + test_input
    let fullCode = fixedCode;
    if (bug.test_input && bug.test_input.trim() !== '') {
      fullCode = fixedCode + '\n' + bug.test_input;
    }

    // Execute on Piston
    let pistonResult;
    try {
      const response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [{ content: fullCode }]
        })
      });

      if (!response.ok) {
        throw new Error(`Piston returned ${response.status}`);
      }

      pistonResult = await response.json();
    } catch (err) {
      console.error('[PISTON ERROR]', err.message);
      return res.status(503).json({ error: 'Compiler offline. Check Docker.' });
    }

    // Get stdout from run output
    const stdout = (pistonResult.run?.stdout || '').trim();
    const stderr = pistonResult.run?.stderr || '';
    const expectedOutput = (bug.expected_output || '').trim();
    const passed = stdout === expectedOutput;

    // Calculate score
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
    const multiplier = difficultyMultiplier[bug.difficulty] || 1;
    const timeBonus = Math.max(0, timeRemaining) / 300;
    const score = passed ? Math.round(multiplier * timeBonus * 100) : 0;

    // Save to leaderboard
    const scoreEntry = {
      id: uuidv4(),
      name,
      language,
      bugId,
      score,
      timeRemaining: Math.max(0, timeRemaining),
      difficulty: bug.difficulty,
      passed,
      timestamp: new Date().toISOString()
    };

    const scores = loadScores();
    scores.push(scoreEntry);
    saveScores(scores);

    res.json({
      passed,
      score,
      explanation: bug.explanation,
      correct_code: bug.correct_code,
      stdout,
      stderr,
      expected_output: expectedOutput
    });
  } catch (err) {
    console.error('[SUBMIT]', err.message);
    res.status(500).json({ error: 'Submission processing failed' });
  }
});

module.exports = router;
