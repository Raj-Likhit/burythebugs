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
        focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-primary
        hover:ring-2 hover:ring-accent-green/30
        ${isSelected
          ? 'border-2 border-accent-green shadow-[0_0_30px_rgba(0,255,148,0.1)] ring-2 ring-accent-green/20'
          : 'border border-border hover:border-accent-green/40'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${name}`}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-accent-green/5 pointer-events-none" aria-hidden="true"></div>
      )}

      {/* Selected Indicator */}
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
        ${isSelected ? 'bg-accent-green scale-100' : 'bg-bg-tertiary border border-border scale-0'}`}
        aria-hidden="true"
      >
        <Check size={14} className="text-bg-primary font-black" />
      </div>

      {/* Language Symbol */}
      <span
        className="font-mono font-black text-[56px] leading-none mb-1 drop-shadow-2xl"
        style={{ color, textShadow: isSelected ? `0 0 20px ${color}` : 'none' }}
        aria-hidden="true"
      >
        {symbol}
      </span>

      {/* Language Name */}
      <span className="text-text-primary font-bold text-lg tracking-tight">
        {name}
      </span>

      {/* Flavor text */}
      <span className="text-text-tertiary text-[10px] text-center font-bold uppercase tracking-widest mt-1">
        {flavor}
      </span>
    </motion.button>
  )
}
