import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function LanguageCard({ language, isSelected, onClick }) {
  const { id, name, symbol, color, flavor } = language

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      id={`lang-card-${id}`}
      onClick={onClick}
      className={`
        relative w-full h-[160px] rounded-2xl p-6 flex flex-col items-center justify-center gap-2
        transition-all duration-300 cursor-pointer text-left overflow-hidden glass-pane
        ${isSelected
          ? 'border-2 border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.1)]'
          : 'border border-[#30363D44] hover:border-[#00FF9444]'
        }
      `}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#00FF9405] pointer-events-none"></div>
      )}

      {/* Selected Indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
        ${isSelected ? 'bg-[#00FF94] scale-100' : 'bg-[#161B22] border border-[#30363D] scale-0'}`}>
        <Check size={14} className="text-[#080B0F] font-black" />
      </div>

      {/* Language Symbol */}
      <span
        className="font-mono font-black text-[56px] leading-none mb-1 drop-shadow-2xl"
        style={{ color, textShadow: isSelected ? `0 0 20px ${color}44` : 'none' }}
      >
        {symbol}
      </span>

      {/* Language Name */}
      <span className="text-[#E6EDF3] font-bold text-lg tracking-tight">
        {name}
      </span>

      {/* Flavor text */}
      <span className="text-[#484F58] text-[10px] text-center font-bold uppercase tracking-widest mt-1">
        {flavor}
      </span>
    </motion.button>
  )
}
