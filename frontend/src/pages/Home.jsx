import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Bug, Play, Trophy, Activity, Info, X } from "lucide-react";
import { useGameStore, SCREENS } from "../store/useGameStore";

const codeSnippets = [
  { text: 'if n == 0: return 0', top: '3%', left: '2%', rotate: -25, size: 12, color: 'var(--accent-green)' },
  { text: 'arr[len(arr)]', top: '8%', left: '5%', rotate: 10, size: 10, color: 'var(--accent-blue)' },
  { text: 'def solve(n):', top: '14%', left: '3%', rotate: -5, size: 14, color: 'var(--accent-purple)' },
  { text: 'range(1, n)', top: '2%', right: '3%', rotate: 15, size: 14, color: 'var(--accent-amber)' },
  { text: 'stack overflow', top: '7%', right: '5%', rotate: -15, size: 12, color: 'var(--accent-red)' },
  { text: 'NULL pointer', top: '13%', right: '2%', rotate: 25, size: 10, color: 'var(--accent-green)' },
  { text: 'segfault', top: '5%', right: '25%', rotate: -10, size: 14, color: 'var(--accent-red)' },
  { text: 'while(true) {', top: '28%', left: '2%', rotate: -15, size: 10, color: 'var(--accent-purple)' },
  { text: 'malloc(sizeof(int))', top: '58%', left: '3%', rotate: -20, size: 10, color: 'var(--accent-blue)' },
  { text: 'return NULL;', top: '30%', right: '2%', rotate: 10, size: 14, color: 'var(--accent-purple)' },
  { text: 'i = i - 1', top: '40%', right: '3%', rotate: -25, size: 10, color: 'var(--accent-amber)' },
  { text: 'undefined behavior', bottom: '3%', right: '22%', rotate: 5, size: 14, color: 'var(--accent-green)' },
];

export default function Home() {
  const { setPlayerName, setRollNo: setStoreRollNo, setScreen } = useGameStore();

  const [callsign, setCallsign] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [isRollFocused, setIsRollFocused] = useState(false);
  const [rollError, setRollError] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isRollValid = /^1608-\d{2}-\d{3}-\d{3}$/.test(rollNo.trim());
  const canDeploy = callsign.trim().length > 0 && isRollValid;

  const onDeploy = () => {
    setPlayerName(callsign.trim());
    setStoreRollNo(rollNo.trim());
    setScreen(SCREENS.LANG);
  };

  const onViewLeaderboard = () => {
    setScreen(SCREENS.LEADERBOARD);
  };

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-bg-primary">
      {/* Top Right Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 255, 148, 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewLeaderboard}
          className="glass-pane px-4 py-3 md:px-6 md:py-4 rounded-xl border border-accent-green/20 flex items-center gap-2 md:gap-4 text-text-primary transition-all hover:border-accent-green/40 focus:outline-none focus:ring-2 focus:ring-accent-green"
          aria-label="View Leaderboard"
        >
          <Trophy size={16} className="text-accent-green md:w-[18px] md:h-[18px]" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">Leaderboard</span>
        </motion.button>
      </motion.div>

      {/* Cyber Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
          className="hidden md:block absolute pointer-events-none select-none animate-float"
          aria-hidden="true"
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

      <motion.section 
        variants={containerVariants}
        initial="initial"
        animate="enter"
        className="z-10 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-6 md:mb-8 mt-12 md:mt-0 relative" aria-hidden="true">
          <div className="absolute inset-0 bg-accent-green blur-xl opacity-20 animate-pulse"></div>
          <Bug size={64} className="text-accent-green relative w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
        </motion.div>

        <motion.header variants={itemVariants} className="mb-2 md:mb-4 text-center">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-text-secondary">BURY THE </span>
            <span className="text-accent-green hover-glitch inline-block cursor-default select-none glow-text-green">
              BUG
            </span>
          </h1>
        </motion.header>

        <motion.p variants={itemVariants} className="mb-8 md:mb-12 text-text-tertiary font-medium italic text-xs md:text-base text-center px-4">
          Can you squash it before the clock runs out?
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="w-full max-w-md glass-pane p-6 md:p-8 rounded-2xl shadow-2xl border-t-2 border-t-accent-green"
          role="form"
          aria-label="Agent Deployment Form"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-text-tertiary" />
            <label htmlFor="callsign" className="text-text-tertiary text-xs font-bold tracking-wider uppercase">
              AGENT IDENTIFIER
            </label>
          </div>

          <div className="relative mb-8">
            <input 
              id="callsign"
              type="text" 
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your callsign..."
              className={`w-full bg-bg-secondary text-text-primary px-4 py-4 rounded-xl border transition-all duration-200 outline-none font-medium
                ${isFocused ? "border-accent-green shadow-[0_0_12px_rgba(0,255,148,0.15)]" : "border-border"}`}
            />
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${callsign.trim() ? "opacity-100" : "opacity-0"}`}>
              <div className="bg-accent-green/20 text-accent-green text-[10px] font-bold px-2 py-1 rounded border border-accent-green/40">READY</div>
            </div>
          </div>

          {/* Roll Number Input */}
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-text-tertiary" />
            <label htmlFor="rollno" className="text-text-tertiary text-xs font-bold tracking-wider uppercase">
              CLEARANCE CODE (ROLL NO)
            </label>
          </div>

          <div className="relative mb-10">
            <input 
              id="rollno"
              type="text" 
              value={rollNo}
              onChange={(e) => {
                setRollNo(e.target.value);
                if (rollError) setRollError(false);
              }}
              onFocus={() => setIsRollFocused(true)}
              onBlur={() => {
                setIsRollFocused(false);
                if (rollNo && !isRollValid) setRollError(true);
              }}
              placeholder="1608-__-___-___"
              className={`w-full bg-bg-secondary text-text-primary px-4 py-4 rounded-xl border transition-all duration-200 outline-none font-mono text-base
                ${isRollFocused ? "border-accent-green shadow-[0_0_12px_rgba(0,255,148,0.15)]" : 
                  rollError ? "border-accent-red shadow-[0_0_12px_rgba(255,59,59,0.15)]" : "border-border"}`}
            />
            {rollError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-8 left-0 text-accent-red text-[10px] font-bold uppercase tracking-wider"
                role="alert"
              >
                Invalid Roll Format. Use 1608-XX-XXX-XXX
              </motion.div>
            )}
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${isRollValid ? "opacity-100" : "opacity-0"}`}>
              <div className="bg-accent-green/20 text-accent-green text-[10px] font-bold px-2 py-1 rounded border border-accent-green/40">VALID</div>
            </div>
          </div>

          <motion.button 
            whileHover={canDeploy ? { scale: 1.02 } : {}}
            whileTap={canDeploy ? { scale: 0.98 } : {}}
            onClick={() => {
              if (canDeploy) onDeploy();
            }}
            disabled={!canDeploy}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-green
              ${canDeploy 
                ? "bg-accent-green text-bg-primary shadow-[0_4px_20px_rgba(0,255,148,0.2)] hover:bg-accent-green-dim" 
                : "bg-bg-tertiary text-text-tertiary cursor-not-allowed opacity-50"}`}
          >
            <Play size={20} fill="currentColor" />
            DEPLOY TO TERMINAL
          </motion.button>

          <footer className="mt-8 pt-6 border-t border-border flex justify-between items-center opacity-80">
            <div className="flex items-center gap-2">
              <div className="live-dot" aria-hidden="true"></div>
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Active System</span>
            </div>
            <div className="flex gap-4 text-text-tertiary">
              <button onClick={() => setShowGuide(true)} className="hover:text-accent-amber transition-colors outline-none focus:text-accent-amber" aria-label="Show Guide">
                <Info size={16} />
              </button>
            </div>
          </footer>
        </motion.div>

        <motion.nav variants={itemVariants} className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-6 px-4" aria-label="Supported Languages">
          {['Python', 'C', 'C++', 'Java'].map(lang => (
            <span key={lang} className="text-[10px] md:text-xs font-bold text-border uppercase tracking-widest px-3 py-2 border border-border rounded-lg hover:border-text-tertiary hover:text-text-tertiary transition-all cursor-default">
              {lang}
            </span>
          ))}
        </motion.nav>
      </motion.section>

      {/* Background Decorative Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" aria-hidden="true"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" aria-hidden="true"></div>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-pane p-6 md:p-8 rounded-2xl border-t-2 border-t-accent-amber w-full max-w-lg relative"
            >
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-6 right-6 text-text-tertiary hover:text-accent-red transition-colors"
                aria-label="Close Guide"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-3">
                <Info className="text-accent-amber" /> Rules & Protocol
              </h2>
              
              <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                <p><strong className="text-accent-green">Objective:</strong> Scan the code, find the logic flaw, and repair the bug before the system clock hits zero.</p>
                <p><strong className="text-accent-green">Languages:</strong> Select from Python, Java, C, or C++. Different languages offer various skill multipliers (Java rewards more points)!</p>
                <p><strong className="text-accent-green">Scoring:</strong> Faster fixes yield higher points. Base points scale aggressively with task difficulty.</p>
                <p><strong className="text-accent-green">Intel:</strong> Getting stuck? You can request a "Hint" from the terminal, but doing so deducts 5 points from your final resolve score.</p>
              </div>
              
              <button 
                onClick={() => setShowGuide(false)}
                className="mt-8 w-full py-3 bg-bg-secondary text-text-primary rounded-lg border border-border hover:border-accent-amber transition-colors font-bold uppercase tracking-widest text-xs"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
