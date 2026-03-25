import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, ShieldX, RotateCcw, Trophy, 
  Eye, EyeOff, ShieldAlert, Timer as TimerIcon, Zap, ChevronRight 
} from "lucide-react";

export default function Result({ result, bug, onPlayAgain, onLeaderboard }) {
  const [showSolution, setShowSolution] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (result?.passed && result?.score) {
      const duration = 1500;
      const startTime = Date.now();
      const endScore = result.score;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        setDisplayScore(Math.floor(progress * endScore));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [result]);

  if (!result) return null;

  const { passed, score, explanation, correct_code, timeTaken, timeRemaining } = result;
  
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeStr = `${minutes}m ${seconds}s`;
  
  const timeBonus = ((timeRemaining || 0) / 300 * 100).toFixed(0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.1, duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#080B0F] relative overflow-hidden">
      {/* Success Burst VFX */}
      {passed && (
        <div className="success-burst"></div>
      )}

      {/* Cyber Particles Background (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="digital-particle"
            style={{ 
              left: `${Math.random() * 100}%`,
              '--d': `${8 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Background Grids */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[800px] w-full relative z-10"
      >
        {passed ? (
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-[#00FF9422] blur-3xl rounded-full scale-150"></div>
              <ShieldCheck size={80} className="text-[#00FF94] relative z-10" />
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl font-black text-center mb-2 tracking-tighter"
              style={{
                color: "#E6EDF3",
                textShadow: "0 0 40px rgba(0, 255, 148, 0.4)",
              }}
            >
              BUG <span className="text-[#00FF94]">BURIED</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-[#484F58] font-mono text-xs uppercase tracking-[0.3em] mb-8">
              System Integrity Restored
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="glass-pane w-full rounded-2xl p-8 mb-6 border border-[#30363D44] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={120} />
              </div>

              <div className="grid grid-cols-3 gap-8 relative z-10">
                <div className="text-center">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-[#E6EDF3] leading-none mb-1">{displayScore}</span>
                    <span className="text-[10px] text-[#484F58] font-bold uppercase tracking-widest">Total Pts</span>
                  </div>
                </div>
                <div className="text-center border-x border-[#30363D]">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-[#E6EDF3] leading-none mb-1">{timeStr}</span>
                    <span className="text-[10px] text-[#484F58] font-bold uppercase tracking-widest">Time</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-[#00FF94] leading-none mb-1">+{timeBonus}%</span>
                    <span className="text-[10px] text-[#484F58] font-bold uppercase tracking-widest">Bonus</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-4 w-full">
              <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPlayAgain}
                className="flex-1 bg-[#00FF94] text-[#080B0F] font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,148,0.2)]"
              >
                <RotateCcw size={18} />
                Next Challenge
              </motion.button>
              <motion.button 
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 255, 148, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onLeaderboard}
                className="flex-1 border border-[#00FF94] text-[#00FF94] font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <Trophy size={18} />
                Kill Feed
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
              <ShieldX size={64} className="text-[#FF3B3B] mb-4" />
              <h1 className="text-4xl font-black text-[#E6EDF3] tracking-tighter uppercase">Bug <span className="text-[#FF3B3B]">Escaped</span></h1>
              <p className="text-[#484F58] font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Critical Failure in Logic</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-pane rounded-xl overflow-hidden mb-6 border border-[#FF3B3B22]">
              <div className="bg-[#FF3B3B10] px-6 py-3 border-b border-[#FF3B3B15] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FF3B3B] text-[10px] font-bold uppercase tracking-widest">
                  <ShieldAlert size={14} />
                  Error Diagnostic
                </div>
                <button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-[#484F58] hover:text-[#E6EDF3] transition-colors"
                >
                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="p-6">
                <p className="text-[#8B949E] text-sm leading-relaxed mb-6 italic">
                  "{explanation}"
                </p>

                <AnimatePresence>
                  {showSolution && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-[10px] font-bold text-[#484F58] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={10} className="text-[#FFB800]" /> Correct Implementation
                      </div>
                      <pre className="p-4 bg-[#080B0F] rounded-lg border border-[#30363D] text-[#E6EDF3] font-mono text-xs leading-relaxed overflow-x-auto">
                        {correct_code}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <button 
                onClick={onPlayAgain}
                className="flex-1 bg-[#E6EDF3] text-[#080B0F] font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
              >
                <RotateCcw size={18} />
                Try Re-Entry
              </button>
              <button 
                onClick={onLeaderboard}
                className="flex-1 border border-[#30363D] text-[#8B949E] font-black py-4 rounded-xl hover:text-[#E6EDF3] hover:border-[#484F58] transition-all text-sm uppercase tracking-widest"
              >
                Kill Feed
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
