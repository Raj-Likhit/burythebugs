import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Bug, Play, Trophy } from "lucide-react";

const codeSnippets = [
  { text: 'if n == 0: return 0', top: '3%', left: '2%', rotate: -25, size: 12, color: '#00FF94' },
  { text: 'arr[len(arr)]', top: '8%', left: '5%', rotate: 10, size: 10, color: '#4D9EFF' },
  { text: 'def solve(n):', top: '14%', left: '3%', rotate: -5, size: 14, color: '#BF5FFF' },
  { text: 'range(1, n)', top: '2%', right: '3%', rotate: 15, size: 14, color: '#FFB800' },
  { text: 'stack overflow', top: '7%', right: '5%', rotate: -15, size: 12, color: '#FF3B3B' },
  { text: 'NULL pointer', top: '13%', right: '2%', rotate: 25, size: 10, color: '#00FF94' },
  { text: 'segfault', top: '5%', right: '25%', rotate: -10, size: 14, color: '#FF3B3B' },
  { text: 'while(true) {', top: '28%', left: '2%', rotate: -15, size: 10, color: '#BF5FFF' },
  { text: 'malloc(sizeof(int))', top: '58%', left: '3%', rotate: -20, size: 10, color: '#4D9EFF' },
  { text: 'return NULL;', top: '30%', right: '2%', rotate: 10, size: 14, color: '#BF5FFF' },
  { text: 'i = i - 1', top: '40%', right: '3%', rotate: -25, size: 10, color: '#FFB800' },
  { text: 'undefined behavior', bottom: '3%', right: '22%', rotate: 5, size: 14, color: '#00FF94' },
];

export default function Home({ onDeploy, onViewLeaderboard }) {
  const [callsign, setCallsign] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const containerVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#080B0F]">
      {/* Top Right Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 255, 148, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewLeaderboard}
          className="glass-pane px-6 py-3 rounded-xl border border-[#00FF9422] flex items-center gap-3 text-[#E6EDF3] transition-all hover:border-[#00FF9444]"
        >
          <Trophy size={18} className="text-[#00FF94]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Leaderboard</span>
        </motion.button>
      </motion.div>

      {/* Cyber Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="digital-particle"
            style={{ 
              left: `${Math.random() * 100}%`,
              '--d': `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Dynamic Background Snips */}
      {codeSnippets.map((snippet, index) => (
        <motion.span 
          key={index} 
          className="absolute pointer-events-none select-none animate-float"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 + (index % 3) * 0.05 }}
          transition={{ duration: 1, delay: index * 0.1 }}
          style={{
            top: snippet.top, left: snippet.left,
            right: snippet.right, bottom: snippet.bottom,
            "--rotate": `${snippet.rotate}deg`,
            fontSize: `${snippet.size}px`, color: snippet.color,
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
          }}>
          {snippet.text}
        </motion.span>
      ))}

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="enter"
        className="z-10 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-6 relative">
          <div className="absolute inset-0 bg-[#00FF94] blur-xl opacity-20 animate-pulse"></div>
          <Bug size={64} className="text-[#00FF94] relative" strokeWidth={1.5} />
        </motion.div>

        <motion.h1 variants={itemVariants} className="mb-2 text-center">
          <div className="font-mono text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-[#8B949E]">BURY THE </span>
            <span className="text-[#00FF94] hover-glitch inline-block cursor-default select-none glow-text-green">
              BUG
            </span>
          </div>
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-10 text-[#484F58] font-medium italic text-sm">
          Can you squash it before the clock runs out?
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="w-full max-w-md glass-pane p-8 rounded-xl shadow-2xl border-t-2 border-t-[#00FF94]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} className="text-[#484F58]" />
            <label className="text-[#484F58] text-[10px] font-bold tracking-[0.2em] uppercase">
              AGENT IDENTIFIER
            </label>
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && callsign.trim()) {
                  onDeploy(callsign.trim());
                }
              }}
              placeholder="Enter your callsign..."
              className={`w-full bg-[#0D1117] text-[#E6EDF3] px-4 py-3 rounded-lg border transition-all duration-200 outline-none font-medium
                ${isFocused ? "border-[#00FF94] shadow-[0_0_12px_rgba(0,255,148,0.15)]" : "border-[#30363D]"}`}
            />
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${callsign.trim() ? "opacity-100" : "opacity-0"}`}>
              <div className="bg-[#00FF9420] text-[#00FF94] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#00FF9440]">READY</div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (callsign.trim()) onDeploy(callsign.trim());
            }}
            disabled={!callsign.trim()}
            className={`w-full py-3.5 rounded-lg flex items-center justify-center gap-2 font-bold tracking-wide transition-all
              ${callsign.trim() 
                ? "bg-[#00FF94] text-[#080B0F] shadow-[0_4px_20px_rgba(0,255,148,0.2)]" 
                : "bg-[#161B22] text-[#484F58] cursor-not-allowed opacity-50"}`}
          >
            <Play size={18} fill="currentColor" />
            DEPLOY TO TERMINAL
          </motion.button>

          <div className="mt-8 pt-6 border-t border-[#30363D] flex justify-between items-center opacity-70">
            <div className="flex items-center gap-1.5">
              <div className="live-dot"></div>
              <span className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider">50 Bugs Active</span>
            </div>
            <div className="flex gap-3 text-[#484F58]">
              <Trophy size={14} className="hover:text-[#FFB800] transition-colors cursor-help" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex gap-4">
          {['Python', 'C', 'C++', 'Java'].map(lang => (
            <span key={lang} className="text-[10px] font-bold text-[#30363D] uppercase tracking-widest px-2 py-1 border border-[#30363D] rounded hover:border-[#484F58] hover:text-[#484F58] transition-all cursor-default">
              {lang}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Background Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ffffff05] to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ffffff05] to-transparent pointer-events-none"></div>
    </div>
  );
}
