import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Medal, User, Timer as TimerIcon, ArrowLeft, 
  Cpu, Globe, Crosshair, Crown, Activity
} from "lucide-react";
import { useGameStore, SCREENS } from "../store/useGameStore";
import { api, supabase } from "../services/api";

import React from "react";

const langStyles = {
  python: { bg:"var(--accent-blue-dim, rgba(77, 158, 255, 0.1))", color:"var(--accent-blue)", border:"var(--accent-blue-dim, rgba(77, 158, 255, 0.3))" },
  c: { bg:"var(--text-secondary-dim, rgba(139, 148, 158, 0.1))", color:"var(--text-secondary)", border:"var(--text-secondary-dim, rgba(139, 148, 158, 0.3))" },
  cpp: { bg:"var(--accent-purple-dim, rgba(191, 95, 255, 0.1))", color:"var(--accent-purple)", border:"var(--accent-purple-dim, rgba(191, 95, 255, 0.3))" },
  java: { bg:"var(--accent-amber-dim, rgba(255, 184, 0, 0.1))", color:"var(--accent-amber)", border:"var(--accent-amber-dim, rgba(255, 184, 0, 0.3))" },
};

function getRankIcon(rank) {
  if (rank === 1) return <Trophy size={18} className="text-accent-amber" aria-label="1st Place" />;
  if (rank === 2) return <Medal size={18} className="text-[#C0C0C0]" aria-label="2nd Place" />;
  if (rank === 3) return <Medal size={18} className="text-[#CD7F32]" aria-label="3rd Place" />;
  return <span className="text-[10px] font-mono text-text-tertiary" aria-label={`Rank ${rank}`}>#{rank}</span>;
}

const LeaderboardRow = React.memo(({ row, index }) => {
  const lang = langStyles[row.language] || langStyles.python;
  const isTop3 = index < 3;

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={rowVariants}
      whileHover={{ backgroundColor: "rgba(0, 255, 148, 0.05)", x: 4 }}
      className={`grid grid-cols-[40px_1fr_60px] sm:grid-cols-[60px_1.5fr_1.5fr_120px_100px] gap-2 md:gap-4 px-4 sm:px-8 py-3 sm:py-5 items-center transition-colors min-w-[320px]
        ${isTop3 ? 'bg-accent-green/5' : ''}`}
      role="row"
    >
      <div className="flex items-center gap-2" role="cell">
        {index === 0 && <Crown size={14} className="text-accent-amber animate-bounce" aria-hidden="true" />}
        {getRankIcon(index + 1)}
      </div>

      <div className="flex items-center gap-2 md:gap-3 overflow-hidden" role="cell">
        <div className={`w-8 h-8 rounded-lg items-center justify-center shrink-0 hidden sm:flex
          ${isTop3 ? 'bg-accent-green/10 border border-accent-green/20' : 'bg-bg-tertiary border border-border'}`} aria-hidden="true">
          <User size={16} className={isTop3 ? 'text-accent-green' : 'text-text-secondary'} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className={`text-sm font-bold truncate ${isTop3 ? 'text-text-primary' : 'text-text-secondary'}`}>
            {row.name}
          </span>
          {index === 0 && <span className="text-[8px] font-black text-accent-green uppercase tracking-widest">Top Agent</span>}
        </div>
      </div>

      <div className="font-mono text-xs text-text-tertiary truncate hidden sm:block" role="cell">
        {row.rollNo || "N/A"}
      </div>

      <div role="cell" className="hidden sm:block">
        <span className="px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border"
          style={{ backgroundColor: lang.bg, color: lang.color, borderColor: lang.border }}>
          {row.language}
        </span>
      </div>

      <div className={`font-mono text-xs md:text-sm font-black tabular-nums ${index === 0 ? 'text-accent-green glow-text-green' : 'text-text-primary'}`} role="cell">
        {row.score.toLocaleString()}
      </div>
    </motion.div>
  );
});

export default function Leaderboard() {
  const { clearAll } = useGameStore();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch to show data immediately
    fetchScores();

    // Setup Supabase Realtime for updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'scores' },
        () => {
          fetchScores(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchScores = async () => {
    try {
      const data = await api.fetchLeaderboard();
      setScores(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
    setLoading(false);
  };

  const handleBack = () => {
    clearAll();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-bg-primary relative overflow-hidden">
      {/* Search/Data Stream Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <div className="absolute inset-0 bg-repeat-y" style={{ 
          backgroundImage: "linear-gradient(rgba(0,255,148,0.5) 1px, transparent 1px)", 
          backgroundSize: "100% 20px",
          animation: "scanlineScroll 10s linear infinite" 
        }}></div>
      </div>

      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-[1000px] w-full relative z-10"
        aria-label="Leaderboard View"
      >
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-accent-green text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              <Crosshair size={14} />
              <span>Global Kill Feed</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter text-center md:text-left">
              RANKING <span className="text-accent-green glow-text-green">DASHBOARD</span>
            </h1>
            <div className="flex items-center gap-2 mt-2" aria-live="polite">
              <div className="relative w-2 h-2">
                <div className="w-full h-full rounded-full bg-accent-green animate-ping absolute inset-0"></div>
                <div className="w-full h-full rounded-full bg-accent-green relative"></div>
              </div>
              <span className="text-accent-green text-[10px] font-black uppercase tracking-widest">Live Uplink</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-all px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-primary"
            aria-label="Return to Home screen"
          >
            <ArrowLeft size={16} />
            Return to Base
          </motion.button>
        </header>

        {/* Live Feed Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-accent-green/10 text-accent-green" aria-hidden="true">
              <Activity size={20} className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="text-text-primary font-black text-lg tracking-tight leading-none mb-1.5">LIVE SECTOR FEED</h2>
              <p className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider">Monitoring verified kills in real-time</p>
            </div>
          </div>
        </div>

        <section className="glass-pane rounded-2xl overflow-hidden border border-border/40 shadow-2xl flex flex-col" role="table" aria-label="High Scores">
          <div className="overflow-x-auto custom-scrollbar">
            <header className="grid grid-cols-[40px_1fr_60px] sm:grid-cols-[60px_1.5fr_1.5fr_120px_100px] gap-2 md:gap-4 px-4 sm:px-8 py-3 sm:py-5 bg-bg-tertiary/40 border-b border-border/40 min-w-[320px]" role="row">
              {["Rank", "Callsign", "Roll No", "Language", "Total Pts"].map((h) => (
                <span key={h} role="columnheader" className={`text-[10px] font-black uppercase tracking-widest text-text-tertiary ${h === 'Roll No' || h === 'Language' ? 'hidden sm:block' : ''}`}>{h}</span>
              ))}
            </header>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-border/30"
            >
              {scores.length > 0 ? scores.map((row, index) => (
                <LeaderboardRow key={row.id || index} row={row} index={index} />
              )) : !loading && (
                <div className="py-20 text-center flex flex-col items-center gap-4" role="row">
                  <Cpu size={48} className="text-border animate-pulse" />
                  <p className="text-text-tertiary font-mono text-sm tracking-widest uppercase">No verified kills detected...</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <footer className="flex items-center justify-between mt-12">
          <div className="flex items-center gap-4 text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
            <Globe size={14} aria-hidden="true" />
            <span>Region: Event_Stall_Alpha</span>
            <div className="w-1 h-1 rounded-full bg-border" aria-hidden="true"></div>
            <span>Nodes: {scores.length} Active</span>
          </div>
        </footer>
      </motion.section>
    </main>
  );
}
