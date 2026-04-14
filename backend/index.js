require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const bugsRouter = require('./routes/bugs');
const submitRouter = require('./routes/submit');
const leaderboardRouter = require('./routes/leaderboard');
const hintRouter = require('./routes/hint');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/bug', bugsRouter);
app.use('/api/submit', submitRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/hint', hintRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n  ══════════════════════════════════════`);
  console.log(`  ▓ BURY THE BUG — Backend Online     ▓`);
  console.log(`  ▓ Port: ${PORT}                        ▓`);
  console.log(`  ══════════════════════════════════════\n`);
});
