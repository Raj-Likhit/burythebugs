import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Terminal, Shield, Zap, ChevronRight } from "lucide-react";
import LanguageCard from "../components/LanguageCard";

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
  { text: 'malloc(sizeof(int))', top: '58%', left: '3%', rotate: -20, size: 9, color: '#4D9EFF' },
  { text: 'return NULL;', top: '30%', right: '2%', rotate: 10, size: 11, color: '#BF5FFF' },
  { text: 'int i = 1; i < n', top: '50%', right: '2%', rotate: 5, size: 10, color: '#00FF94' },
  { text: 'memory leak', bottom: '10%', right: '5%', rotate: 10, size: 10, color: '#FF3B3B' },
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#080B0F]">
      {/* Background Snips */}
      {codeSnippets.map((snippet, index) => (
        <span key={index} className="absolute pointer-events-none select-none opacity-[0.05] font-mono whitespace-nowrap"
          style={{
            top: snippet.top, left: snippet.left, right: snippet.right, bottom: snippet.bottom,
            transform: `rotate(${snippet.rotate}deg)`, fontSize: `${snippet.size}px`, color: snippet.color
          }}>
          {snippet.text}
        </span>
      ))}

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-[800px] w-full relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 text-[#00FF94] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <Shield size={14} />
            <span>Select System Interface</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#E6EDF3] tracking-tighter text-center mb-4">
            CHOOSE YOUR <span className="text-[#00FF94] glow-text-green">WEAPON</span>
          </h1>
          <p className="text-[#8B949E] text-center text-sm font-medium tracking-wide max-w-[400px]">
            The deployment environment varies by logic. Select the core runtime language for this mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {languages.map((lang) => (
            <LanguageCard 
              key={lang.id}
              language={lang}
              isSelected={selected === lang.id}
              onClick={() => setSelected(lang.id)}
            />
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#484F58] hover:text-[#8B949E] transition-colors text-[10px] font-black uppercase tracking-widest px-8 py-3 order-2 md:order-1"
          >
            <ArrowLeft size={16} />
            Abort Mission
          </motion.button>

          <motion.button 
            whileHover={selected ? { scale: 1.02, y: -2 } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            onClick={() => selected && onLock(selected)}
            disabled={!selected}
            className={`w-full md:w-[240px] py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs tracking-widest uppercase transition-all order-1 md:order-2
              ${selected 
                ? 'bg-[#00FF94] text-[#080B0F] shadow-[0_10px_30px_rgba(0,255,148,0.2)]' 
                : 'bg-[#161B22] text-[#484F58] border border-[#30363D] cursor-not-allowed opacity-50'}`}
          >
            {selected ? (
              <>
                Initialize Fix <ChevronRight size={18} />
              </>
            ) : 'Awaiting Selection...'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
