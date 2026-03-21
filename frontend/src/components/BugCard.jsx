export default function BugCard({ bug, language }) {
  const difficultyColors = { easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' }
  const langBadge = {
    python: 'badge-python',
    c: 'badge-c',
    cpp: 'badge-cpp',
    java: 'badge-java'
  }

  if (!bug) return null

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary mb-3">
        {bug.title}
      </h2>
      <div className="flex gap-2 mb-4">
        <span className={`badge ${langBadge[language] || ''}`}>
          {language === 'cpp' ? 'C++' : language.toUpperCase()}
        </span>
        <span className={`badge ${difficultyColors[bug.difficulty] || ''}`}>
          {bug.difficulty}
        </span>
      </div>
      <div className="border-t border-border my-4"></div>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        Read the code carefully. There is exactly one bug hiding in the snippet. 
        Find it, fix it, and submit before time runs out.
      </p>
    </div>
  )
}
