import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Timer as TimerIcon, Target, ShieldAlert, Activity, Cpu, 
  ChevronRight, Loader2, Zap, CheckCircle2, AlertCircle, HelpCircle, Bug as BugIcon
} from 'lucide-react'
import Timer from '../components/Timer'

const FILE_EXT = { python: 'solution.py', c: 'solution.c', cpp: 'solution.cpp', java: 'Solution.java' }
const MONACO_LANG = { python: 'python', c: 'c', cpp: 'cpp', java: 'java' }

export default function Game({ playerName, language, playedBugIds, onBugLoaded, onSubmitResult, onExhausted }) {
  const [bug, setBug] = useState(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [hintText, setHintText] = useState('')
  const [hintUsed, setHintUsed] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [editorPos, setEditorPos] = useState({ line: 1, col: 1 })
  const [isTyping, setIsTyping] = useState(false)
  const editorRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    fetchBug()
  }, [])

  const fetchBug = async () => {
    setLoading(true)
    try {
      const exclude = playedBugIds.join(',')
      const res = await fetch(`/api/bug/random?language=${language}&exclude=${exclude}`)
      const data = await res.json()
      if (data.exhausted) {
        onExhausted()
        return
      }
      setBug(data)
      setCode(data.buggy_code)
      onBugLoaded(data)
      setTimerRunning(true)
    } catch (err) {
      console.error('Failed to fetch bug:', err)
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setTimerRunning(false)
    const timeRemaining = window.__timerStop ? window.__timerStop() : 0
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          bugId: bug.id,
          fixedCode: code,
          timeRemaining,
          language
        })
      })
      const data = await res.json()
      if (data.error) {
        setSubmitting(false)
        setTimerRunning(true)
        return
      }
      onSubmitResult({ ...data, timeRemaining, timeTaken: 300 - timeRemaining })
    } catch (err) {
      setSubmitting(false)
      setTimerRunning(true)
    }
  }

  const handleTimeout = () => {
    if (!submitting) {
      handleSubmit()
    }
  }

  const handleHint = async () => {
    if (hintUsed || hintLoading) return
    setHintLoading(true)
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bugId: bug.id, currentCode: code, language })
      })
      const data = await res.json()
      setHintText(data.hint || 'No hint available.')
    } catch {
      setHintText('Hint service unavailable. Try analyzing the logic manually.')
    }
    setHintUsed(true)
    setHintLoading(false)
  }

  const handleEditorChange = (value) => {
    setCode(value)
    setIsTyping(true)
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
      <div className="h-screen w-screen flex items-center justify-center bg-[#080B0F]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="animate-spin text-[#00FF94]" size={48} />
          <span className="text-[#484F58] font-mono text-sm tracking-widest animate-pulse">INITIATING BUG SEARCH...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-row h-screen w-screen bg-[#080B0F] text-[#E6EDF3] overflow-hidden">
      {/* LEFT PANEL */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[35%] glass-pane m-3 rounded-xl p-6 flex flex-col shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF9444] to-transparent"></div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[#484F58] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Target size={14} />
            <span>Mission Objective</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse delay-75"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse delay-150"></div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 tracking-tight leading-tight">
          {bug?.title}
        </h2>
        
        <div className="flex gap-2 mb-6">
          <span className="badge badge-python flex items-center gap-1.5 border border-[#3776AB44]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3776AB]"></span>
            {language}
          </span>
          <span className={`badge flex items-center gap-1.5 border 
            ${bug?.difficulty === 'easy' ? 'badge-easy border-[#4D9EFF44]' : 
              bug?.difficulty === 'medium' ? 'badge-medium border-[#FFB80044]' : 
              'badge-hard border-[#BF5FFF44]'}`}>
            {bug?.difficulty === 'easy' ? <CheckCircle2 size={12} /> : 
              bug?.difficulty === 'medium' ? <AlertCircle size={12} /> : 
              <Zap size={12} />}
            {bug?.difficulty}
          </span>
        </div>

        <div className="space-y-4 mb-8 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-start gap-3">
            <ShieldAlert size={16} className="text-[#00FF94] mt-1 shrink-0" />
            <p className="text-[#8B949E] text-sm leading-relaxed">
              {bug?.description}
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <button 
            onClick={handleHint}
            disabled={hintUsed || hintLoading}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase transition-all
              ${hintUsed || hintLoading 
                ? 'bg-[#161B22] text-[#484F58] cursor-not-allowed opacity-50' 
                : 'border border-[#FFB800] text-[#FFB800] hover:bg-[#FFB80010] active:scale-[0.98]'}`}
          >
            {hintLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Zap size={16} />
            )}
            {hintLoading ? 'Analyzing...' : hintUsed ? 'Hint Extracted' : 'Access AI Hint'}
          </button>

          <AnimatePresence>
            {hintUsed && hintText && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: 10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-[#161B22] border-l-2 border-[#FFB800] p-4 rounded-r-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black text-[#FFB800] uppercase tracking-tighter bg-[#FFB80020] px-1 rounded">Transmission Received</span>
                </div>
                <p className="text-[#8B949E] text-xs font-mono leading-relaxed italic">
                  "{hintText}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT PANEL - CODE EDITOR */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 flex flex-col pt-3 pr-3 pb-3 gap-3 overflow-hidden"
      >
        <div className="flex gap-3 h-full overflow-hidden">
          {/* Main Editor Section */}
          <div className="flex-1 flex flex-col crt-glow rounded-xl overflow-hidden border border-[#30363D44] bg-[#080B0F]">
            <div className="bg-[#161B22] px-6 py-3 border-b border-[#30363D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF3B3B22] border border-[#FF3B3B44]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFB80022] border border-[#FFB80044]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#00FF9422] border border-[#00FF9444]"></div>
                </div>
                <span className="ml-4 text-[10px] font-bold text-[#484F58] uppercase tracking-[0.2em]">Source Code Buffer</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#00FF9410] border border-[#00FF9420] rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse"></div>
                <span className="text-[9px] font-black text-[#00FF94] uppercase tracking-widest">Mission Active</span>
              </div>
            </div>

            <div className={`flex-1 relative transition-all duration-300 ${isTyping ? 'shadow-[inset_0_0_40px_rgba(0,255,148,0.05)]' : ''}`}>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-6 z-10 bg-[#00FF9410] text-[#00FF94] text-[9px] font-bold px-2 py-1 rounded border border-[#00FF9430] uppercase tracking-widest"
                >
                  Changes Detected
                </motion.div>
              )}
              <Editor
                height="100%"
                language={MONACO_LANG[language]}
                value={code}
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
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
                }}
              />
            </div>

            <div className="h-12 bg-[#161B22] border-t border-[#30363D] flex items-center justify-between px-6">
              <div className="flex items-center gap-4 text-[#484F58] font-mono text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <ChevronRight size={12} />
                  <span>UTF-8</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>LN {editorPos.line}, COL {editorPos.col}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex items-center gap-2.5 px-6 h-8 rounded-lg font-bold text-xs transition-all
                  ${submitting 
                    ? 'bg-[#161B22] text-[#484F58] cursor-not-allowed' 
                    : 'bg-[#00FF94] text-[#080B0F] hover:shadow-[0_0_20px_rgba(0,255,148,0.3)]'}`}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} fill="currentColor" />}
                {submitting ? 'EXECUTING TEST...' : 'DEPLOY FIX'}
              </motion.button>
            </div>
          </div>

          {/* Right Utilities Section */}
          <div className="w-[180px] flex flex-col gap-3 h-full">
            <div className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300
              ${timerRunning ? 'bg-[#0D1117] border-[#30363D]' : 'bg-[#FF3B3B10] border-[#FF3B3B44]'}`}>
            <TimerIcon size={16} className={timerRunning ? "text-[#8B949E]" : "text-[#FF3B3B] animate-pulse"} />
              <Timer duration={300} onTimeout={handleTimeout} isRunning={timerRunning} />
            </div>
            
            <div className="flex-1 glass-pane rounded-xl p-4 border border-[#30363D44] flex flex-col items-center justify-center gap-3">
              <BugIcon size={32} className="text-[#30363D]" />
              <p className="text-[8px] font-black text-[#484F58] uppercase tracking-[0.2em] text-center">System Scan in Progress...</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
