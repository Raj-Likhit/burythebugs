import { Terminal, Shield, AlertCircle } from "lucide-react"

export default function BugCard({ bug, language }) {
  if (!bug) return null

  return (
    <div className="glass-pane p-6 rounded-xl border border-[#30363D44]">
      <div className="flex items-center gap-2 text-[#484F58] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
        <Terminal size={14} />
        <span>Incident Report</span>
      </div>

      <h2 className="text-xl font-bold text-[#E6EDF3] mb-4 tracking-tight">
        {bug.title}
      </h2>

      <div className="flex gap-2 mb-6">
        <span className="badge badge-python flex items-center gap-1.5 border border-[#3776AB44]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3776AB]"></span>
          {language === 'cpp' ? 'C++' : language.toUpperCase()}
        </span>
        <span className={`badge flex items-center gap-1.5 border 
          ${bug.difficulty === 'easy' ? 'badge-easy border-[#4D9EFF44]' : 
            bug.difficulty === 'medium' ? 'badge-medium border-[#FFB80044]' : 
            'badge-hard border-[#BF5FFF44]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full 
            ${bug.difficulty === 'easy' ? 'bg-[#4D9EFF]' : 
              bug.difficulty === 'medium' ? 'bg-[#FFB800]' : 
              'bg-[#BF5FFF]'}`}></span>
          {bug.difficulty}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-[#0D1117] rounded-lg border border-[#30363D44]">
          <AlertCircle size={16} className="text-[#FFB800] mt-1 shrink-0" />
          <p className="text-[#8B949E] text-sm leading-relaxed italic">
            "A critical flaw has been detected in the core logic. Analyze the source, pinpoint the failure, and deploy a fix before the buffer overflows."
          </p>
        </div>
      </div>
    </div>
  )
}
