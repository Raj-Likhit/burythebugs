const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const BUG_FILE = path.join(__dirname, '..', 'data', 'bugs.json');

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[DB] SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all bugs asynchronously (from local JSON).
 */
async function getBugs() {
  try {
    const data = await fs.readFile(BUG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DB] Error reading bugs:', err);
    return [];
  }
}

/**
 * Get all scores from Supabase.
 */
async function getScores() {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;
    
    // Map database fields to application fields if necessary
    return (data || []).map(row => ({
      ...row,
      rollNo: row.roll_no // Map roll_no to rollNo for frontend compatibility
    }));
  } catch (err) {
    console.error('[DB] Error fetching scores from Supabase:', err.message);
    return [];
  }
}

/**
 * Add a score to Supabase.
 */
async function addScore(scoreEntry) {
  try {
    const dbEntry = {
      name: scoreEntry.name,
      roll_no: scoreEntry.rollNo,
      language: scoreEntry.language,
      score: scoreEntry.score
      // id and timestamp are handled by Supabase defaults if omitted, 
      // but we can pass them if they are already provided/needed.
    };

    const { data, error } = await supabase
      .from('scores')
      .insert([dbEntry])
      .select();

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[DB] Error adding score to Supabase:', err.message);
    throw err;
  }
}

module.exports = {
  getBugs,
  getScores,
  addScore
};
