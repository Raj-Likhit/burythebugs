import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, ChevronRight, Terminal, Cpu, Code2, Binary } from "lucide-react";
import LanguageCard from "../components/LanguageCard";
import { useGameStore, SCREENS } from "../store/useGameStore";

const codeSnippets = [
  { text: 'if n == 0: return 0', top: '3%', left: '2%', rotate: -25, size: 10, color: 'var(--accent-green)' },
  { text: 'arr[len(arr)]', top: '8%', left: '5%', rotate: 10, size: 9, color: 'var(--accent-blue)' },
  { text: 'def solve(n):', top: '14%', left: '3%', rotate: -5, size: 11, color: 'var(--accent-purple)' },
  { text: 'range(1, n)', top: '2%', right: '3%', rotate: 15, size: 11, color: 'var(--accent-amber)' },
  { text: 'stack overflow', top: '7%', right: '5%', rotate: -15, size: 10, color: 'var(--accent-red)' },
  { text: 'NULL pointer', top: '13%', right: '2%', rotate: 25, size: 9, color: 'var(--accent-green)' },
  { text: 'null.toString()', top: '3%', left: '22%', rotate: 5, size: 10, color: 'var(--accent-blue)' },
  { text: 'segfault', top: '5%', right: '25%', rotate: -10, size: 11, color: 'var(--accent-red)' },
  { text: 'while(true) {', top: '28%', left: '2%', rotate: -15, size: 9, color: 'var(--accent-purple)' },
  { text: 'malloc(sizeof(int))', top: '58%', left: '3%', rotate: -20, size: 9, color: 'var(--accent-blue)' },
  { text: 'return NULL;', top: '30%', right: '2%', rotate: 10, size: 11, color: 'var(--accent-purple)' },
  { text: 'int i = 1; i < n', top: '50%', right: '2%', rotate: 5, size: 10, color: 'var(--accent-green)' },
  { text: 'memory leak', bottom: '10%', right: '5%', rotate: 10, size: 10, color: 'var(--accent-red)' },
];

const languages = [
  { id: "python", name: "Python", icon: <Terminal size={24} />, description: "Optimal for rapid algorithmic parsing.", color: "accent-blue" },
  { id: "c", name: "C", icon: <Cpu size={24} />, description: "Low-level memory corruption detection.", color: "text-secondary" },
  { id: "cpp", name: "C++", icon: <Code2 size={24} />, description: "Object-oriented pointer analysis.", color: "accent-purple" },
  { id: "java", name: "Java", icon: <Binary size={24} />, description: "JVM bytecode reverse engineering.", color: "accent-amber" },
];

export default function LanguageSelect() {
  const { setChosenLanguage, setScreen } = useGameStore();
  const [selected, setSelected] = useState(null);

  const handleLock = () => {
    if (selected) {
      setChosenLanguage(selected);
      setScreen(SCREENS.GAME);
    }
  };

  const handleBack = () => {
    setScreen(SCREENS.HOME);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-bg-primary">
      {/* Background Snips */}
      {codeSnippets.map((snippet, index) => (
        <span key={index} className="hidden md:block absolute pointer-events-none select-none opacity-[0.05] font-mono whitespace-nowrap"
          aria-hidden="true"
          style={{
            top: snippet.top, left: snippet.left, right: snippet.right, bottom: snippet.bottom,
            transform: `rotate(${snippet.rotate}deg)`, fontSize: `${snippet.size}px`, color: snippet.color
          }}>
          {snippet.text}
        </span>
      ))}

      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-[800px] w-full relative z-10"
      >
        <header className="flex flex-col items-center mb-8 md:mb-12">
          <div className="flex items-center gap-2 text-accent-green text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <Shield size={14} />
            <span className="text-center">Select System Interface</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter text-center mb-4 px-2">
            CHOOSE YOUR <span className="text-accent-green glow-text-green">WEAPON</span>
          </h1>
          <p className="text-text-secondary text-center text-xs md:text-sm font-medium tracking-wide max-w-[400px] px-4">
            The deployment environment varies by logic. Select the core runtime language for this mission.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" role="group" aria-label="Language selection">
          {languages.map((lang) => (
            <LanguageCard 
              key={lang.id}
              language={lang}
              isSelected={selected === lang.id}
              onClick={() => setSelected(lang.id)}
            />
          ))}
        </div>

        <nav className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6" aria-label="Language Actions">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center justify-center w-full md:w-auto gap-2 text-text-tertiary hover:text-text-secondary transition-colors text-[10px] font-black uppercase tracking-widest px-8 py-4 md:py-3 order-2 md:order-1 focus:outline-none focus:ring-2 focus:ring-text-secondary rounded"
            aria-label="Abort Mission"
          >
            <ArrowLeft size={16} />
            Abort Mission
          </motion.button>

          <motion.button 
            whileHover={selected ? { scale: 1.02, y: -2 } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            onClick={handleLock}
            disabled={!selected}
            className={`w-full md:w-[240px] py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xs tracking-widest uppercase transition-all order-1 md:order-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-accent-green
              ${selected 
                ? 'bg-accent-green text-bg-primary shadow-[0_10px_30px_rgba(0,255,148,0.2)] hover:bg-accent-green-dim' 
                : 'bg-bg-tertiary text-text-tertiary border border-border cursor-not-allowed opacity-50'}`}
          >
            {selected ? (
              <>
                Initialize Fix <ChevronRight size={18} />
              </>
            ) : 'Awaiting Selection...'}
          </motion.button>
        </nav>
      </motion.section>
    </main>
  );
}
