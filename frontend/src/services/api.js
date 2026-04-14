import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Core API Service
 * Centralizes all fetch calls from the frontend to the 
 * backend server for consistency and clean error handling.
 */
export const api = {
  fetchBug: async (language, playedBugIds = []) => {
    try {
      const exclude = playedBugIds.join(',');
      const res = await fetch(`/api/bug/random?language=${language}&exclude=${exclude}`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[API] fetchBug failed:', err);
      throw new Error("Unable to connect to the mission server. Retrying...");
    }
  },

  submitResult: async (payload) => {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[API] submitResult failed:', err);
      return { error: "Network uplink failed during deployment. Please try again." };
    }
  },

  fetchHint: async (bugId) => {
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bugId })
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[API] fetchHint failed:', err);
      return { hint: "Hint transmission degraded due to network interference." };
    }
  },

  fetchLeaderboard: async () => {
    try {
      // Use Supabase directly for leaderboard fetching
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      return (data || []).map(row => ({
        ...row,
        rollNo: row.roll_no
      }));
    } catch (err) {
      console.error('[API] fetchLeaderboard via Supabase failed:', err.message);
      // Fallback to legacy API if Supabase fails (optional)
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return await res.json();
      } catch (fallbackErr) {
        return [];
      }
    }
  },

  submitLeaderboard: async (payload) => {
    try {
      // Keep submission via backend for validation/logging
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[API] submitLeaderboard failed:', err);
      return { error: true };
    }
  }
};
