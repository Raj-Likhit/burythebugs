import { useState } from "react";

const codeSnippets = [
  { text: 'if n == 0: return 0', top: '3%', left: '2%', rotate: -25, size: 10, color: '#00FF94' },
  { text: 'arr[len(arr)]', top: '8%', left: '5%', rotate: 10, size: 9, color: '#4D9EFF' },
  { text: 'def solve(n):', top: '14%', left: '3%', rotate: -5, size: 11, color: '#BF5FFF' },
  { text: 'range(1, n)', top: '2%', right: '3%', rotate: 15, size: 11, color: '#FFB800' },
  { text: 'stack overflow', top: '7%', right: '5%', rotate: -15, size: 10, color: '#FF3B3B' },
  { text: 'NULL pointer', top: '13%', right: '2%', rotate: 25, size: 9, color: '#00FF94' },
  { text: 'null.toString()', top: '3%', left: '22%', rotate: 5, size: 10, color: '#4D9EFF' },
  { text: 'segfault', top: '5%', right: '25%', rotate: -10, size: 11, color: '#FF3B3B' },
  { text: 'while(true) {', top: '28%', left: '2%', rotate: -15, size: 9, color: '#BF5FFF' },
  { text: 'if (x = 0) return;', top: '38%', left: '3%', rotate: 20, size: 10, color: '#FFB800' },
  { text: 'if (n = null)', top: '48%', left: '2%', rotate: 0, size: 11, color: '#00FF94' },
  { text: 'malloc(sizeof(int))', top: '58%', left: '3%', rotate: -20, size: 9, color: '#4D9EFF' },
  { text: 'catch(Exception e){}', top: '68%', left: '2%', rotate: 15, size: 10, color: '#FF3B3B' },
  { text: 'return NULL;', top: '30%', right: '2%', rotate: 10, size: 11, color: '#BF5FFF' },
  { text: 'i = i - 1', top: '40%', right: '3%', rotate: -25, size: 9, color: '#FFB800' },
  { text: 'int i = 1; i < n', top: '50%', right: '2%', rotate: 5, size: 10, color: '#00FF94' },
  { text: '*(ptr + 1)', top: '60%', right: '3%', rotate: -10, size: 11, color: '#4D9EFF' },
  { text: 'i <= arr.length', top: '70%', right: '2%', rotate: 20, size: 9, color: '#FF3B3B' },
  { text: 'return None', bottom: '3%', left: '2%', rotate: 25, size: 10, color: '#BF5FFF' },
  { text: 'int x = 1/0;', bottom: '9%', left: '4%', rotate: -5, size: 11, color: '#FFB800' },
  { text: '// segfault here', bottom: '15%', left: '2%', rotate: 15, size: 9, color: '#00FF94' },
  { text: 'while i < n', bottom: '4%', right: '3%', rotate: -15, size: 11, color: '#4D9EFF' },
  { text: 'memory leak', bottom: '10%', right: '5%', rotate: 10, size: 10, color: '#FF3B3B' },
  { text: 'infinite loop?', bottom: '16%', right: '2%', rotate: -20, size: 9, color: '#BF5FFF' },
  { text: 'int[] arr = new int[n-1]', bottom: '2%', left: '20%', rotate: 0, size: 10, color: '#FFB800' },
  { text: 'undefined behavior', bottom: '3%', right: '22%', rotate: 5, size: 11, color: '#00FF94' },
  { text: 'for i in range(10):', top: '22%', left: '5%', rotate: -10, size: 10, color: '#4D9EFF' },
  { text: 'int arr[5] = {1,2,3};', bottom: '25%', left: '3%', rotate: 25, size: 11, color: '#FF3B3B' },
  { text: 'arr[n] = 0;', bottom: '35%', left: '2%', rotate: -5, size: 9, color: '#BF5FFF' },
  { text: 'printf("%d", result);', top: '20%', right: '4%', rotate: 0, size: 9, color: '#FFB800' },
  { text: 'arr[i+1] = arr[i]', bottom: '28%', right: '3%', rotate: -15, size: 10, color: '#00FF94' },
  { text: '// TODO: fix this', bottom: '38%', right: '2%', rotate: 15, size: 11, color: '#4D9EFF' },
  { text: 'off by one?', top: '78%', left: '3%', rotate: 10, size: 10, color: '#FF3B3B' },
  { text: 'NullPointerException', top: '82%', left: '2%', rotate: -25, size: 9, color: '#BF5FFF' },
  { text: 'index out of bounds', top: '80%', right: '3%', rotate: 5, size: 11, color: '#FFB800' },
  { text: '// bug: returns 0', bottom: '22%', left: '5%', rotate: -10, size: 10, color: '#00FF94' },
];

export default function Home({ onDeploy }) {
  const [callsign, setCallsign] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundColor: "#080B0F",
        backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}>
      {codeSnippets.map((snippet, index) => (
        <span key={index} className="absolute pointer-events-none select-none"
          style={{
            top: snippet.top, left: snippet.left,
            right: snippet.right, bottom: snippet.bottom,
            transform: `rotate(${snippet.rotate}deg)`,
            fontSize: `${snippet.size}px`, color: snippet.color,
            opacity: 0.15 + (index % 3) * 0.05,
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: "nowrap",
          }}>
          {snippet.text}
        </span>
      ))}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-6"
        style={{ filter: "drop-shadow(0 0 8px #00FF9488)" }}>
        <path d="M20 14L17 8" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 14L31 8" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="24" cy="28" rx="10" ry="14" stroke="#00FF94" strokeWidth="2" fill="none"/>
        <path d="M14 22L8 18" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 28L6 28" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 34L8 38" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 22L40 18" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 28L42 28" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 34L40 38" stroke="#00FF94" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <h1 className="mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "48px", fontWeight: 700, wordSpacing: "0px", letterSpacing: "-0.02em" }}>
        <span style={{ color: "#8B949E" }}>BURY THE </span>
        <span style={{ color: "#00FF94", textShadow: "0 0 20px #00FF9466" }}>BUG</span>
      </h1>
      <p className="mb-8" style={{ color: "#484F58", fontSize: "14px", fontStyle: "italic" }}>
        Can you squash it before the clock runs out?
      </p>
      <div className="w-full"
        style={{ maxWidth: "440px", backgroundColor: "#161B22", border: "1px solid #30363D", borderTop: "2px solid #00FF94", borderRadius: "10px", padding: "32px" }}>
        <label className="block mb-2"
          style={{ color: "#484F58", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          CALLSIGN
        </label>
        <input type="text" value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && callsign.trim()) {
              onDeploy(callsign.trim());
            }
          }}
          placeholder="Enter your callsign..."
          className="w-full mb-4 outline-none"
          style={{
            backgroundColor: "#0D1117",
            border: isFocused ? "1px solid #00FF94" : "1px solid #30363D",
            boxShadow: isFocused ? "0 0 0 3px #00FF9420" : "none",
            color: "#E6EDF3", padding: "12px 16px", fontSize: "15px",
            borderRadius: "6px", fontFamily: "'Inter', sans-serif",
            transition: "border 150ms ease, box-shadow 150ms ease",
          }}/>
        <button className="w-full cursor-pointer"
          onClick={() => {
            if (callsign.trim()) onDeploy(callsign.trim());
          }}
          disabled={!callsign.trim()}
          style={{ backgroundColor: "#00FF94", color: "#080B0F", fontWeight: 700, letterSpacing: "0.05em", borderRadius: "6px", padding: "12px", border: "none", fontSize: "15px", transition: "background-color 150ms ease, transform 150ms ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00CC77"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#00FF94"; e.currentTarget.style.transform = "scale(1)"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}>
          DEPLOY →
        </button>
        <p style={{ color: "#484F58", fontSize: "12px", textAlign: "center", marginTop: "12px" }}>
          50 bugs loaded · Python · C · C++ · Java
        </p>
      </div>
    </main>
  );
}
