export default function LanguageCard({ language, isSelected, onClick }) {
  const { id, name, symbol, color, flavor } = language

  return (
    <button
      id={`lang-card-${id}`}
      onClick={onClick}
      className={`
        relative w-full h-[160px] rounded-[10px] p-5 flex flex-col items-center justify-center gap-2
        transition-all duration-150 cursor-pointer text-left
        ${isSelected
          ? 'border-2 border-accent-green bg-[#00FF9410]'
          : 'border border-border bg-bg-tertiary hover:border-accent-green hover:bg-bg-hover hover:scale-[1.03]'
        }
      `}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <span className="absolute top-2 right-3 text-accent-green font-bold text-lg">
          ✓
        </span>
      )}

      {/* Language Symbol */}
      <span
        className="font-mono font-bold text-[48px] leading-none"
        style={{ color }}
      >
        {symbol}
      </span>

      {/* Language Name */}
      <span className="text-text-primary font-bold text-[18px]">
        {name}
      </span>

      {/* Flavor text */}
      <span className="text-text-tertiary text-xs text-center">
        {flavor}
      </span>
    </button>
  )
}
