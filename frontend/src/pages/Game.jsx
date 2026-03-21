import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import Timer from '../components/Timer'
import BugCard from '../components/BugCard'

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
  const [spinIdx, setSpinIdx] = useState(0)
  const [editorPos, setEditorPos] = useState({ line: 1, col: 1 })
  const [changed, setChanged] = useState(false)
  const spinChars = ['|', '/', '-', '\\']
  const editorRef = useRef(null)

  // Spinner animation
  useEffect(() => {
    if (!submitting) return
    const iv = setInterval(() => setSpinIdx(p => (p + 1) % 4), 150)
    return () => clearInterval(iv)
  }, [submitting])

  // Fetch bug
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
        alert(data.error)
        setSubmitting(false)
        setTimerRunning(true)
        return
      }
      onSubmitResult({ ...data, timeRemaining, timeTaken: 300 - timeRemaining })
    } catch (err) {
      alert('Submission failed. Check if backend is running.')
      setSubmitting(false)
      setTimerRunning(true)
    }
  }

  const handleTimeout = () => {
    handleSubmit()
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

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    editor.onDidChangeCursorPosition((e) => {
      setEditorPos({ line: e.position.lineNumber, col: e.position.column })
    })
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-8">
          <div className="skeleton h-6 w-48 mb-4"></div>
          <div className="skeleton h-4 w-32 mb-6"></div>
          <div className="skeleton h-64 w-full mb-4"></div>
          <div className="skeleton h-10 w-40"></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", width: "100vw" }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{ width: "38%", backgroundColor: "#0D1117", padding: "24px", borderRight: "1px solid #30363D", display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#484F58", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          BURY THE BUG / GAME
        </div>
        <div style={{ color: "#E6EDF3", fontSize: "18px", fontWeight: "bold", marginTop: "16px" }}>
          {bug?.title}
        </div>
        
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <span style={{
            backgroundColor: language === 'python' ? '#3776AB22' : language === 'c' ? '#A8B9CC22' : language === 'cpp' ? '#00599C22' : '#ED8B0022',
            color: language === 'python' ? '#3776AB' : language === 'c' ? '#A8B9CC' : language === 'cpp' ? '#4D9EFF' : '#ED8B00',
            border: `1px solid ${language === 'python' ? '#3776AB44' : language === 'c' ? '#A8B9CC44' : language === 'cpp' ? '#00599C44' : '#ED8B0044'}`,
            padding: "3px 8px", borderRadius: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            {language}
          </span>
          <span style={{
            backgroundColor: bug?.difficulty === 'easy' ? '#4D9EFF22' : bug?.difficulty === 'medium' ? '#FFB80022' : '#BF5FFF22',
            color: bug?.difficulty === 'easy' ? '#4D9EFF' : bug?.difficulty === 'medium' ? '#FFB800' : '#BF5FFF',
            border: `1px solid ${bug?.difficulty === 'easy' ? '#4D9EFF44' : bug?.difficulty === 'medium' ? '#FFB80044' : '#BF5FFF44'}`,
            padding: "3px 8px", borderRadius: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            {bug?.difficulty}
          </span>
        </div>

        <div style={{ height: "1px", backgroundColor: "#30363D", margin: "16px 0" }}></div>
        
        <div style={{ color: "#484F58", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          THE BUG
        </div>
        <p style={{ color: "#8B949E", fontSize: "14px", lineHeight: "1.6", marginTop: "8px" }}>
          {bug?.description}
        </p>

        <button 
          onClick={handleHint}
          disabled={hintUsed || hintLoading}
          style={{
            marginTop: "24px", width: "100%", backgroundColor: "transparent", border: "1px solid #FFB800",
            color: "#FFB800", padding: "10px 16px", borderRadius: "6px", fontWeight: 600, letterSpacing: "0.05em",
            cursor: hintUsed || hintLoading ? "not-allowed" : "pointer",
            opacity: hintUsed || hintLoading ? 0.4 : 1,
            transition: "background-color 150ms ease"
          }}
          onMouseEnter={(e) => { if (!hintUsed && !hintLoading) e.currentTarget.style.backgroundColor = "#FFB80015"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          {hintLoading ? (<span>ANALYZING... {spinChars[spinIdx]}</span>) : hintUsed ? 'HINT USED' : 'GET HINT'}
        </button>

        {hintText && (
          <div style={{
            backgroundColor: "#161B22", borderLeft: "3px solid #FFB800", padding: "12px", borderRadius: "0 6px 6px 0",
            marginTop: "8px", color: "#8B949E", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace"
          }}>
            {hintText}
          </div>
        )}

        <div style={{ marginTop: "auto" }}>
          <span style={{ color: "#484F58", fontSize: "12px" }}>
            Fix the bug in the editor →<span style={{ animation: "blink 1s infinite" }}>|</span>
          </span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: "62%", backgroundColor: "#0D1117", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ height: "40px", backgroundColor: "#161B22", borderBottom: "1px solid #30363D", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "8px", height: "8px", backgroundColor: "#00FF94", borderRadius: "50%" }}></div>
            <span style={{ color: "#8B949E", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", marginLeft: "8px" }}>
              {FILE_EXT[language]}
            </span>
          </div>
          <div>
            <Timer duration={300} onTimeout={handleTimeout} isRunning={timerRunning} />
          </div>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1, position: "relative" }}>
          <Editor
            height="100%"
            language={MONACO_LANG[language]}
            value={code}
            onChange={(val) => { setCode(val || ''); setChanged(true); }}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              lineNumbersMinChars: 3,
              scrollBeyondLastLine: false,
              renderLineHighlight: 'gutter',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Bottom bar */}
        <div style={{ height: "36px", backgroundColor: "#161B22", borderTop: "1px solid #30363D", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px" }}>
          <span style={{ color: "#484F58", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            Ln {editorPos.line}, Col {editorPos.col}
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: "#00FF94", color: "#080B0F", fontWeight: 700, letterSpacing: "0.05em",
              borderRadius: "6px", padding: "6px 20px", height: "28px", border: "none", cursor: submitting ? "not-allowed" : "pointer",
              transition: "background-color 150ms ease, transform 150ms ease",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.backgroundColor = "#00CC77"; e.currentTarget.style.transform = "scale(1.02)"; } }}
            onMouseLeave={(e) => { if (!submitting) { e.currentTarget.style.backgroundColor = "#00FF94"; e.currentTarget.style.transform = "scale(1)"; } }}
          >
            {submitting ? (<span>EXECUTING... {spinChars[spinIdx]}</span>) : 'SUBMIT FIX ▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
