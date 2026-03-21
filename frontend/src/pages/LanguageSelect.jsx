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

const languages = [
  { id: 'python', symbol: 'Py', name: 'Python', color: '#3776AB', flavor: 'Readable. Powerful. Sneaky bugs.' },
  { id: 'c', symbol: 'C', name: 'C', color: '#A8B9CC', flavor: 'Raw. Fast. Unforgiving.' },
  { id: 'cpp', symbol: 'C++', name: 'C++', color: '#00599C', flavor: 'Power and complexity combined.' },
  { id: 'java', symbol: 'J', name: 'Java', color: '#ED8B00', flavor: 'Verbose. Robust. Classic.' },
];

export default function LanguageSelect({ onLock, onBack }) {
  const [selected, setSelected] = useState(null);

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
      <button className="absolute top-6 left-6"
        onClick={onBack}
        style={{ color: "#484F58", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", background: "none", border: "none", cursor: "pointer" }}>
        ← BACK
      </button>
      <h1 className="text-center"
        style={{ color: "#00FF94", fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 700, textShadow: "0 0 20px #00FF9466", letterSpacing: "normal" }}>
        CHOOSE YOUR WEAPON
      </h1>
      <p className="text-center mt-2 mb-8" style={{ color: "#8B949E", fontSize: "14px" }}>
        Pick the language you are most comfortable with
      </p>
      <div className="grid grid-cols-2 gap-4" style={{ maxWidth: "600px" }}>
        {languages.map((lang) => {
          const isSelected = selected === lang.id;
          return (
            <button key={lang.id} onClick={() => setSelected(lang.id)}
              className="relative flex flex-col items-center justify-center cursor-pointer"
              style={{
                width: "270px", height: "160px",
                backgroundColor: isSelected ? "#00FF9410" : "#161B22",
                border: isSelected ? "2px solid #00FF94" : "1px solid #30363D",
                borderRadius: "10px", transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "#00FF94"; e.currentTarget.style.backgroundColor = "#1C2128"; e.currentTarget.style.transform = "scale(1.03)"; }}}
              onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "#30363D"; e.currentTarget.style.backgroundColor = "#161B22"; e.currentTarget.style.transform = "scale(1)"; }}}>
              {isSelected && (
                <span className="absolute" style={{ top: "8px", right: "12px", color: "#00FF94", fontSize: "12px" }}>✓</span>
              )}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "52px", fontWeight: 700, color: lang.color }}>
                {lang.symbol}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 700, color: "#E6EDF3", marginTop: "4px" }}>
                {lang.name}
              </span>
              <span style={{ fontSize: "12px", color: "#484F58", marginTop: "4px" }}>
                {lang.flavor}
              </span>
            </button>
          );
        })}
      </div>
      <button disabled={!selected} className="mt-6"
        onClick={() => selected && onLock(selected)}
        style={{
          width: "200px",
          backgroundColor: selected ? "#00FF94" : "#30363D",
          color: selected ? "#080B0F" : "#484F58",
          fontWeight: 700, letterSpacing: "0.05em", borderRadius: "6px",
          padding: "12px", border: "none", fontSize: "15px",
          cursor: selected ? "pointer" : "not-allowed",
          transition: "background-color 150ms ease, transform 150ms ease",
        }}
        onMouseEnter={(e) => { if (selected) { e.currentTarget.style.backgroundColor = "#00CC77"; e.currentTarget.style.transform = "scale(1.02)"; }}}
        onMouseLeave={(e) => { if (selected) { e.currentTarget.style.backgroundColor = "#00FF94"; e.currentTarget.style.transform = "scale(1)"; }}}
        onMouseDown={(e) => { if (selected) e.currentTarget.style.transform = "scale(0.98)"; }}
        onMouseUp={(e) => { if (selected) e.currentTarget.style.transform = "scale(1.02)"; }}>
        LOCK IN →
      </button>
    </main>
  );
}
