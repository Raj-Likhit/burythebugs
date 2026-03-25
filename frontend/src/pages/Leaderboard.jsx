import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Medal, User, Timer as TimerIcon, ArrowLeft, 
  Cpu, Zap, Globe, Crosshair, Target, ChevronRight, Crown, Activity,
  Shield
} from "lucide-react";

const langStyles = {
  python: { bg:"rgba(55, 118, 171, 0.1)", color:"#3776AB", border:"rgba(55, 118, 171, 0.3)" },
  c: { bg:"rgba(168, 185, 204, 0.1)", color:"#A8B9CC", border:"rgba(168, 185, 204, 0.3)" },
  cpp: { bg:"rgba(0, 89, 156, 0.1)", color:"#4D9EFF", border:"rgba(0, 89, 156, 0.3)" },
  java: { bg:"rgba(237, 139, 0, 0.1)", color:"#ED8B00", border:"rgba(237, 139, 0, 0.3)" },
};

const diffStyles = {
  easy: { bg:"rgba(77, 158, 255, 0.1)", color:"#4D9EFF", border:"rgba(77, 158, 255, 0.3)" },
  medium: { bg:"rgba(255, 184, 0, 0.1)", color:"#FFB800", border:"rgba(255, 184, 0, 0.3)" },
  hard: { bg:"rgba(191, 95, 255, 0.1)", color:"#BF5FFF", border:"rgba(191, 95, 255, 0.3)" },
};

function getRankIcon(rank) {
  if (rank === 1) return <Trophy size={18} className="text-[#FFB800]" />;
  if (rank === 2) return <Medal size={18} className="text-[#C0C0C0]" />;
  if (rank === 3) return <Medal size={18} className="text-[#CD7F32]" />;
  return <span className="text-[10px] font-mono text-[#484F58]">#{rank}</span>;
}

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setScores(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
    setLoading(false);
  };

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#080B0F] relative overflow-hidden">
      {/* Search/Data Stream Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-repeat-y" style={{ 
          backgroundImage: "linear-gradient(rgba(0,255,148,0.5) 1px, transparent 1px)", 
          backgroundSize: "100% 20px",
          animation: "scanlineScroll 10s linear infinite" 
        }}></div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-[1000px] w-full relative z-10"
      >
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-[#00FF94] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              <Crosshair size={14} />
              <span>Global Kill Feed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#E6EDF3] tracking-tighter">
              RANKING <span className="text-[#00FF94] glow-text-green">DASHBOARD</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative w-2.5 h-2.5">
                <div className="w-full h-full rounded-full bg-[#00FF94] animate-ping absolute inset-0"></div>
                <div className="w-full h-full rounded-full bg-[#00FF94] relative"></div>
              </div>
              <span className="text-[#00FF94] text-[10px] font-black uppercase tracking-widest">Live Uplink</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#484F58] transition-all px-6 py-3 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Return to Base
          </motion.button>
        </div>

        {/* Live Feed Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00FF9410] text-[#00FF94]">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-[#E6EDF3] font-black text-lg tracking-tight leading-none mb-1">LIVE SECTOR FEED</h2>
              <p className="text-[#484F58] text-[9px] font-bold uppercase tracking-[0.2em]">Monitoring verified kills in real-time</p>
            </div>
          </div>
        </div>

        <div className="glass-pane rounded-2xl overflow-hidden border border-[#30363D44] shadow-2xl">
          <div className="grid grid-cols-[80px_1fr_120px_100px_120px_120px] gap-4 px-8 py-5 bg-[#161B2266] border-b border-[#30363D44]">
            {["Rank", "Callsign", "Language", "Score", "Difficulty", "Efficiency"].map((h) => (
              <span key={h} className="text-[10px] font-black uppercase tracking-widest text-[#484F58]">{h}</span>
            ))}
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-[#30363D22]"
          >
            {scores.length > 0 ? scores.map((row, index) => {
              const lang = langStyles[row.language] || langStyles.python;
              const diff = diffStyles[row.difficulty] || diffStyles.medium;
              const isTop3 = index < 3;
              
              const mins = Math.floor((300 - (row.timeRemaining || 0)) / 60).toString().padStart(2, "0");
              const secs = ((300 - (row.timeRemaining || 0)) % 60).toString().padStart(2, "0");

              return (
                <motion.div 
                  key={row.id || index}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(0, 255, 148, 0.02)", x: 4 }}
                  className={`grid grid-cols-[80px_1fr_120px_100px_120px_120px] gap-4 px-8 py-4 items-center transition-colors
                    ${isTop3 ? 'bg-[#00FF9403]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && <Crown size={14} className="text-[#FFB800] animate-bounce" />}
                    {getRankIcon(index + 1)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center 
                      ${isTop3 ? 'bg-[#00FF9410] border border-[#00FF9422]' : 'bg-[#161B22] border border-[#30363D]'}`}>
                      <User size={16} className={isTop3 ? 'text-[#00FF94]' : 'text-[#8B949E]'} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isTop3 ? 'text-[#E6EDF3]' : 'text-[#8B949E]'}`}>
                        {row.name}
                      </span>
                      {index === 0 && <span className="text-[8px] font-black text-[#00FF94] uppercase tracking-widest">Top Agent</span>}
                    </div>
                  </div>

                  <div>
                    <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border"
                      style={{ backgroundColor: lang.bg, color: lang.color, borderColor: lang.border }}>
                      {row.language}
                    </span>
                  </div>

                  <div className={`font-mono text-sm font-black tabular-nums ${index === 0 ? 'text-[#00FF94] glow-text-green' : 'text-[#E6EDF3]'}`}>
                    {row.score.toLocaleString()}
                  </div>

                  <div>
                    <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border"
                      style={{ backgroundColor: diff.bg, color: diff.color, borderColor: diff.border }}>
                      {row.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#484F58] font-mono text-xs">
                    <TimerIcon size={12} />
                    {mins}:{secs}
                  </div>
                </motion.div>
              );
            }) : !loading && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Cpu size={48} className="text-[#30363D] animate-pulse" />
                <p className="text-[#484F58] font-mono text-sm tracking-widest uppercase">No verified kills detected...</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center gap-4 text-[#484F58] text-[10px] font-bold uppercase tracking-widest">
            <Globe size={14} />
            <span>Region: Event_Stall_Alpha</span>
            <div className="w-1 h-1 rounded-full bg-[#30363D]"></div>
            <span>Nodes: {scores.length} Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
