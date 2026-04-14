import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldX, RotateCcw, Trophy, Eye, EyeOff, ShieldAlert, Zap, ArrowRight, UploadCloud, Loader2 } from "lucide-react";
import { useGameStore, SCREENS } from "../store/useGameStore";
import { api } from "../services/api";

export default function Result() {
  const { 
    result, currentBug: bug, setScreen, setResult, 
    currentRound, incrementRound, cumulativeScore,
    playerName, rollNo, chosenLanguage: language
  } = useGameStore();
  const [showSolution, setShowSolution] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

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

  const handleNextRound = () => {
    setResult(null);
    incrementRound();
    setScreen(SCREENS.GAME);
  };

  const handleSubmitFinal = async () => {
    if (isSubmittingFinal) return;
    setIsSubmittingFinal(true);
    const payload = {
      name: playerName,
      rollNo,
      language,
      totalScore: cumulativeScore
    };
    
    await api.submitLeaderboard(payload);
    setScreen(SCREENS.LEADERBOARD);
  };

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-bg-primary relative overflow-hidden">
      {/* Success Burst VFX */}
      {passed && (
        <div className="success-burst" aria-hidden="true"></div>
      )}

      {/* Cyber Particles Background (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
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
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}>
      </div>
      
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[800px] w-full relative z-10"
        aria-live="polite"
      >
        {passed ? (
          <article className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mb-6 relative"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-accent-green/20 blur-3xl rounded-full scale-150"></div>
              <ShieldCheck size={80} className="text-accent-green relative z-10" />
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl font-black text-center mb-2 tracking-tighter text-text-primary glow-text-green"
            >
              BUG <span className="text-accent-green">BURIED</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-text-tertiary font-mono text-xs uppercase tracking-[0.3em] mb-8">
              System Integrity Restored
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="glass-pane w-full rounded-2xl p-4 md:p-8 mb-6 border border-border relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                <Trophy size={110} className="md:w-[120px] md:h-[120px]" />
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-8 relative z-10">
                <div className="text-center">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary leading-none mb-1">{displayScore}</span>
                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Total Pts</span>
                  </div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary leading-none mb-1">{timeStr}</span>
                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Time</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-accent-green leading-none mb-1">+{timeBonus}%</span>
                    <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Bonus</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <nav className="flex gap-4 w-full" aria-label="Result Actions">
              {currentRound < 5 ? (
                <motion.button 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextRound}
                  className="flex-1 bg-accent-green text-bg-primary font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,148,0.2)] hover:bg-accent-green-dim focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-primary"
                >
                  Proceed to Round {currentRound + 1}
                  <ArrowRight size={18} />
                </motion.button>
              ) : (
                <motion.button 
                  variants={itemVariants}
                  whileHover={!isSubmittingFinal ? { scale: 1.02, backgroundColor: "rgba(0, 255, 148, 0.05)" } : {}}
                  whileTap={!isSubmittingFinal ? { scale: 0.98 } : {}}
                  onClick={handleSubmitFinal}
                  disabled={isSubmittingFinal}
                  className={`flex-1 border border-accent-green text-accent-green font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-primary
                    ${isSubmittingFinal ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmittingFinal ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                  Record Final Score ({cumulativeScore})
                </motion.button>
              )}
            </nav>
          </article>
        ) : (
          <article className="flex flex-col w-full">
            <motion.header variants={itemVariants} className="flex flex-col items-center mb-6 md:mb-10 px-4">
              <ShieldX size={64} className="text-accent-red mb-4 md:w-16 md:h-16 w-12 h-12" aria-hidden="true" />
              <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter uppercase text-center">Bug <span className="text-accent-red">Escaped</span></h1>
              <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-[0.2em] mt-2 text-center">{result.escapeReason || "Critical Failure in Logic"}</p>
            </motion.header>

            <motion.section variants={itemVariants} className="glass-pane rounded-2xl overflow-hidden mb-6 border border-accent-red/20">
              <header className="bg-accent-red/10 px-4 md:px-6 py-3 md:py-4 border-b border-accent-red/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-red text-[10px] font-bold uppercase tracking-widest">
                  <ShieldAlert size={14} />
                  Error Diagnostic
                </div>
                <button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-text-tertiary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-text-secondary rounded"
                  aria-label={showSolution ? "Hide correct solution" : "Show correct solution"}
                  aria-expanded={showSolution}
                >
                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </header>
              <div className="p-6">
                <div className="text-text-secondary text-sm leading-relaxed mb-6 italic">
                  {typeof explanation === 'string' ? (
                    `"${explanation}"`
                  ) : explanation && typeof explanation === 'object' ? (
                    <div className="space-y-4 not-italic">
                      <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-4">
                        <div className="flex flex-col gap-4 text-left font-mono">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-accent-amber font-bold uppercase tracking-widest">Input Data</span>
                            <div className="text-xs bg-bg-primary p-3 rounded-lg border border-border text-text-secondary whitespace-pre-wrap">
                              {JSON.stringify(explanation.input || 'N/A')}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest">Expected</span>
                              <div className="text-xs bg-bg-primary p-3 rounded-lg border border-accent-green/20 text-accent-green break-words">
                                {JSON.stringify(explanation.expected || 'N/A')}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] text-accent-red font-bold uppercase tracking-widest">Actual</span>
                              <div className="text-xs bg-bg-primary p-3 rounded-lg border border-accent-red/20 text-accent-red break-words">
                                {JSON.stringify(explanation.actual || 'N/A')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    "Diagnostic analysis failed to provide specific details."
                  )}
                </div>

                <AnimatePresence>
                  {showSolution && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Zap size={10} className="text-accent-amber" /> Correct Implementation
                      </div>
                      <pre className="p-4 bg-bg-primary rounded-xl border border-border text-text-primary font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar">
                        {correct_code}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            <motion.nav variants={itemVariants} className="flex gap-4">
              {currentRound < 5 ? (
                <button 
                  onClick={handleNextRound}
                  className="flex-1 bg-text-primary text-bg-primary font-black py-4 rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 focus:ring-offset-bg-primary"
                >
                  Abandon Bug / Next Round ({currentRound + 1})
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmitFinal}
                  disabled={isSubmittingFinal}
                  className={`flex-1 border border-border text-text-secondary font-black py-4 rounded-xl hover:text-text-primary hover:border-text-tertiary transition-all text-sm uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-bg-primary flex justify-center items-center gap-2
                    ${isSubmittingFinal ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmittingFinal && <Loader2 size={18} className="animate-spin" />}
                  Record Final Score ({cumulativeScore})
                </button>
              )}
            </motion.nav>
          </article>
        )}
      </motion.section>
    </main>
  );
}
