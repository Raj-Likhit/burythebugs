const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/hint
router.post('/', async (req, res) => {
  try {
    const { bugId } = req.body;

    if (!bugId) {
      return res.status(400).json({ error: 'Missing bugId' });
    }

    const bugs = await db.getBugs();
    const bug = bugs.find(b => b.id === bugId);
    
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    // Return the hardcoded hint from bugs.json
    res.json({ hint: bug.hint || 'Try analyzing the logic manually.' });
  } catch (err) {
    console.error('[HINT]', err.message);
    res.status(500).json({ error: 'Hint retrieval failed' });
  }
});

module.exports = router;
