const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../services/db');

/**
 * Normalizes code for comparison by:
 * 1. Removing all whitespace
 * 2. Removing comments (single line and multi-line)
 * 3. Removing semicolons (optional, but helps with consistency)
 */
function normalizeCode(code) {
  if (!code) return '';
  return code
    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/(\w)\s+(\w)/g, '$1 $2')         // Keep at least one space between words/keywords
    .replace(/\s+/g, ' ')                     // Reduce multiple spaces to one
    .replace(/;/g, '')                         // Remove semicolons
    .trim();
}

// POST /api/submit
router.post('/', async (req, res) => {
  try {
    const { name, rollNo, bugId, fixedCode, timeRemaining, language } = req.body;

    if (!name || !rollNo || !bugId || fixedCode === undefined || timeRemaining === undefined || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bugs = await db.getBugs();
    const bug = bugs.find(b => b.id === bugId);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    // Local Validation Logic
    const userNormalized = normalizeCode(fixedCode);
    const correctNormalized = normalizeCode(bug.correct_code);
    const passed = userNormalized === correctNormalized;

    // Calculate score
    const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
    const languageMultipliers = { python: 1.0, java: 1.2, cpp: 1.1, c: 1.1 };

    const diffMult = difficultyMultiplier[bug.difficulty] || 1;
    const langMult = languageMultipliers[language.toLowerCase()] || 1.0;
    const timeBonus = Math.max(0, timeRemaining) / 300;
    
    const score = passed ? Math.round(diffMult * langMult * timeBonus * 100) : 0;

    // Removed db logic here as this is no longer saving individual bugs to the leaderboard.

    res.json({
      passed,
      score,
      explanation: bug.explanation,
      correct_code: bug.correct_code,
      stdout: passed ? 'Validation Successful' : 'Validation Failed: Logic does not match correct solution.',
      stderr: '',
      expected_output: 'Match with correct_code'
    });
  } catch (err) {
    console.error('[SUBMIT]', err.message);
    res.status(500).json({ error: 'Submission processing failed' });
  }
});

module.exports = router;
