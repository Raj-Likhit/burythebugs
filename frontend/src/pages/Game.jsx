import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Timer as TimerIcon, Target, ShieldAlert, Activity, ChevronRight, 
  Loader2, Zap, CheckCircle2, AlertCircle, HelpCircle, Bug as BugIcon
} from 'lucide-react'
import Timer from '../components/Timer'
import { useGameStore, SCREENS } from '../store/useGameStore'
import { api } from '../services/api'
import { playKeystrokeSound, playHintSound, playErrorSound, playSuccessSound } from '../utils/audio'

const MONACO_LANG = { python: 'python', c: 'c', cpp: 'cpp', java: 'java' }

export default function Game() {
  const { 
    playerName, rollNo, chosenLanguage: language, playedBugIds, addPlayedBugId, 
    setCurrentBug, setResult, setScreen, currentRound, addScore 
  } = useGameStore();

  const [bug, setBug] = useState(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [hintText, setHintText] = useState('')
  const [hintUsed, setHintUsed] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [editorPos, setEditorPos] = useState({ line: 1, col: 1 })
  const [isTyping, setIsTyping] = useState(false)
  const [showObjectiveMob, setShowObjectiveMob] = useState(false)
  const editorRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    fetchBug()
  }, [])

  const fetchBug = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await api.fetchBug(language, playedBugIds);
      if (data.exhausted) {
        setScreen(SCREENS.LANG)
        return
      }
      
      // Atomic Update
      setBug(data)
      setCode(data.buggy_code)
      setCurrentBug(data)
      addPlayedBugId(data.id)
      
      // Reset mission states
      setHintText('')
      setHintUsed(false)
      setTimerRunning(true)
      setShowObjectiveMob(false) // Close objective panel on mobile for new round
    } catch (err) {
      console.error('Failed to fetch bug:', err)
      setErrorMsg(err.message || 'Mission Control Offline');
    }
    setLoading(false)
  }

  const handleSubmit = async (reason = 'Incorrect Fix') => {
    if (submitting) return
    setSubmitting(true)
    setTimerRunning(false)
    const timeRemaining = window.__timerStop ? window.__timerStop() : 0
    const finalCode = editorRef.current ? editorRef.current.getValue() : code;
    try {
      const payload = {
        name: playerName,
        rollNo,
        bugId: bug.id,
        fixedCode: finalCode,
        timeRemaining,
        language
      };
      const data = await api.submitResult(payload);
      if (data.error) {
        setSubmitting(false)
        setTimerRunning(true)
        return
      }
      const hintPenalty = { easy: 5, medium: 8, hard: 10 };
      const penalty = hintPenalty[bug?.difficulty] || 5;
      if (data.score > 0 && hintUsed) data.score = Math.max(0, data.score - penalty);
      
      if (data.score > 0) {
        playSuccessSound();
      } else {
        playErrorSound();
      }

      addScore(data.score || 0);

      setResult({ 
        ...data, 
        timeRemaining, 
        timeTaken: 300 - timeRemaining, 
        escapeReason: reason,
        bugId: bug.id
      });
      setScreen(SCREENS.RESULT)
    } catch (err) {
      setSubmitting(false)
      setTimerRunning(true)
    }
  }

  const handleTimeout = () => {
    if (!submitting) {
      handleSubmit('Out of Time')
    }
  }

  const handleHint = async () => {
    if (hintUsed || hintLoading) return
    playHintSound()
    setHintLoading(true)
    try {
      const data = await api.fetchHint(bug.id);
      setHintText(data.hint || 'No hint available.')
    } catch {
      setHintText('Hint service unavailable. Try analyzing the logic manually.')
    }
    setHintUsed(true)
    setHintLoading(false)
  }

  const handleEditorChange = () => {
    playKeystrokeSound()
    if (!isTyping) setIsTyping(true)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setEditorPos({ line: e.position.lineNumber, col: e.position.column })
    })
  }

  if (loading) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-bg-primary">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="animate-spin text-accent-green" size={48} />
          <span className="text-text-tertiary font-mono text-sm tracking-widest animate-pulse">INITIATING BUG SEARCH...</span>
        </motion.div>
      </main>
    )
  }

  if (errorMsg) {
    return (
      <main className="h-screen w-screen flex flex-col items-center justify-center bg-bg-primary gap-6 p-8">
        <ShieldAlert className="text-accent-red animate-pulse" size={64} />
        <h1 className="text-2xl font-black text-text-primary tracking-widest uppercase text-center">Connection Severed</h1>
        <p className="text-text-secondary font-mono text-sm max-w-md text-center">{errorMsg}</p>
        <button 
          onClick={() => setScreen(SCREENS.HOME)}
          className="mt-4 border border-border text-text-secondary hover:text-text-primary px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest"
        >
          Return to Base
        </button>
      </main>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        key={bug?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col md:flex-row h-screen w-screen bg-bg-primary text-text-primary overflow-hidden"
      >
      {/* LEFT PANEL */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          height: window.innerWidth < 768 ? (showObjectiveMob ? '60svh' : '64px') : 'auto'
        }}
        className={`w-full md:w-[35%] glass-pane m-2 md:m-4 rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col shadow-2xl relative overflow-hidden shrink-0 transition-all duration-500 ease-in-out z-30
          ${window.innerWidth < 768 && !showObjectiveMob ? 'overflow-hidden cursor-pointer' : ''}`}
        onClick={() => window.innerWidth < 768 && !showObjectiveMob && setShowObjectiveMob(true)}
        aria-label="Bug details"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-green/30 to-transparent" aria-hidden="true"></div>
        
        <header className="flex items-center justify-between mb-4 md:mb-8 shrink-0">
          <div className="flex items-center gap-2 text-text-tertiary text-[10px] md:text-xs font-bold uppercase tracking-wider">
            <Target size={14} className="md:w-4 md:h-4 text-accent-green" />
            <span>Mission Objective</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowObjectiveMob(!showObjectiveMob); }}
              className="md:hidden p-1 text-text-tertiary hover:text-accent-green transition-colors"
            >
              <ChevronRight className={`transition-transform duration-300 ${showObjectiveMob ? 'rotate-90' : 'rotate-0'}`} size={18} />
            </button>
            <div className="flex gap-2" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse delay-150"></div>
            </div>
          </div>
        </header>

        <div className={`flex-1 flex flex-col transition-opacity duration-300 ${window.innerWidth < 768 && !showObjectiveMob ? 'opacity-0 invisible h-0' : 'opacity-100 visible'}`}>

        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
          {bug?.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8">
          <span className="badge badge-python flex items-center gap-2 border border-accent-blue/30 px-3 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
            {language}
          </span>
          <span className={`badge flex items-center gap-2 border px-3 py-1 text-xs
            ${bug?.difficulty === 'easy' ? 'badge-easy border-accent-blue/30' : 
              bug?.difficulty === 'medium' ? 'badge-medium border-accent-amber/30' : 
              'badge-hard border-accent-purple/30'}`}>
            {bug?.difficulty === 'easy' ? <CheckCircle2 size={14} /> : 
              bug?.difficulty === 'medium' ? <AlertCircle size={14} /> : 
              <Zap size={14} />}
            {bug?.difficulty}
          </span>
        </div>

        <section className="space-y-4 mb-4 md:mb-8 overflow-y-auto pr-2 md:pr-4 custom-scrollbar flex-1">
          <div className="flex items-start gap-3 md:gap-4">
            <ShieldAlert size={18} className="text-accent-green mt-1 shrink-0 md:w-5 md:h-5" />
            <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
              {bug?.description}
            </p>
          </div>
        </section>

        <footer className="mt-auto space-y-4 pt-4 border-t border-border">
          <button 
            onClick={handleHint}
            disabled={hintUsed || hintLoading}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-xs tracking-widest uppercase transition-all focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2 focus:ring-offset-bg-primary
              ${hintUsed || hintLoading 
                ? 'bg-bg-tertiary text-text-tertiary cursor-not-allowed opacity-50' 
                : 'border border-accent-amber text-accent-amber hover:bg-accent-amber/10 active:scale-[0.98]'}`}
            aria-label="Request AI Hint"
          >
            {hintLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Zap size={18} />
            )}
            {hintLoading ? 'Analyzing...' : hintUsed ? 'Hint Extracted' : 'Access AI Hint'}
          </button>

          <AnimatePresence>
            {hintUsed && hintText && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: 10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-bg-tertiary border-l-2 border-accent-amber p-4 rounded-r-xl"
                role="status"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-accent-amber uppercase tracking-tighter bg-accent-amber/10 px-2 py-0.5 rounded">Transmission Received</span>
                </div>
                <p className="text-text-secondary text-sm font-mono leading-relaxed italic">
                  "{hintText}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          </footer>
        </div>
      </motion.aside>

      {/* RIGHT PANEL - CODE EDITOR */}
      <motion.section 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 flex flex-col p-2 pt-0 md:pt-4 md:pr-4 md:pb-4 md:pl-0 gap-2 md:gap-4 overflow-hidden"
        aria-label="Code Editor"
      >
        <div className="flex flex-col lg:flex-row gap-2 md:gap-4 h-full overflow-hidden">
          {/* Main Editor Section */}
          <div className="flex-1 flex flex-col crt-glow rounded-xl md:rounded-2xl overflow-hidden border border-border bg-bg-primary shadow-2xl min-h-[40svh]">
            <header className="bg-bg-tertiary px-3 md:px-6 py-2 md:py-4 border-b border-border flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex gap-2" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-accent-red/20 border border-accent-red/40"></div>
                  <div className="w-3 h-3 rounded-full bg-accent-amber/20 border border-accent-amber/40"></div>
                  <div className="w-3 h-3 rounded-full bg-accent-green/20 border border-accent-green/40"></div>
                </div>
                <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Source Code Buffer</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" aria-hidden="true"></div>
                <span className="text-[10px] font-black text-accent-green uppercase tracking-widest">Round {currentRound}/5 Active</span>
              </div>
            </header>

            <div className={`flex-1 relative transition-all duration-300 ${isTyping ? 'shadow-[inset_0_0_40px_rgba(0,255,148,0.05)]' : ''}`}>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-6 z-10 bg-accent-green/10 text-accent-green text-[10px] font-bold px-2 py-1 rounded border border-accent-green/30 uppercase tracking-widest"
                  aria-live="polite"
                >
                  Changes Detected
                </motion.div>
              )}
                <Editor
                key={bug?.id}
                height="100%"
                language={MONACO_LANG[language] || 'cpp'}
                defaultValue={code}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                theme="vs-dark"
                options={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  minimap: { enabled: false },
                  padding: { top: 20, bottom: 20 },
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'all',
                  lineHeight: 24,
                  automaticLayout: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
                }}
              />
            </div>

            <footer className="h-auto md:h-16 bg-bg-tertiary border-t border-border flex flex-col sm:flex-row items-center justify-between p-2 sm:px-6 gap-2 sm:gap-0">
              <div className="flex items-center gap-4 md:gap-6 text-text-tertiary font-mono text-[10px] md:text-xs uppercase tracking-wider" aria-live="polite">
                <div className="hidden sm:flex items-center gap-2">
                  <ChevronRight size={14} />
                  <span>UTF-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>LN {editorPos.line}, COL {editorPos.col}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmit()}
                disabled={submitting}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 h-10 md:h-10 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-tertiary
                  ${submitting 
                    ? 'bg-bg-primary text-text-tertiary cursor-not-allowed' 
                    : 'bg-accent-green text-bg-primary hover:shadow-[0_0_20px_rgba(0,255,148,0.3)]'}`}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Activity size={18} fill="currentColor" />}
                {submitting ? 'EXECUTING TEST...' : 'DEPLOY FIX'}
              </motion.button>
            </footer>
          </div>

          {/* Right Utilities Section */}
          <aside className="w-full lg:w-[200px] flex flex-row lg:flex-col gap-2 md:gap-4 lg:h-full shrink-0" aria-label="Game Utilities">
            <div className={`flex-1 flex flex-row lg:flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 shadow-lg
              ${timerRunning ? 'bg-bg-secondary border-border' : 'bg-accent-red/10 border-accent-red/40'}`}>
            <TimerIcon size={20} className={`md:w-6 md:h-6 ${timerRunning ? "text-text-secondary" : "text-accent-red animate-pulse"}`} />
              <Timer duration={300} onTimeout={handleTimeout} isRunning={timerRunning} />
            </div>
            
            <div className="hidden sm:flex flex-1 glass-pane rounded-xl md:rounded-2xl p-6 border border-border flex-col items-center justify-center gap-4">
              <BugIcon size={40} className="text-border" aria-hidden="true" />
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest text-center leading-relaxed">System Scan in Progress...</p>
            </div>
          </aside>
        </div>
      </motion.section>
      </motion.main>
    </AnimatePresence>
  )
}
