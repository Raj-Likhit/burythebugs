import { useState, useEffect } from 'react'
import Home from './pages/Home'
import LanguageSelect from './pages/LanguageSelect'
import Game from './pages/Game'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'

const SCREENS = { HOME: 'home', LANG: 'lang', GAME: 'game', RESULT: 'result', LEADERBOARD: 'leaderboard' }

function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [pageClass, setPageClass] = useState('page-enter')
  const [playerName, setPlayerName] = useState('')
  const [chosenLanguage, setChosenLanguage] = useState('')
  const [currentBug, setCurrentBug] = useState(null)
  const [result, setResult] = useState(null)
  const [playedBugIds, setPlayedBugIds] = useState([])

  // Clear session on fresh page load
  useEffect(() => {
    localStorage.removeItem('btb_session')
    setPlayedBugIds([])
  }, [])

  // Animate page transitions
  useEffect(() => {
    setPageClass('page-enter')
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageClass('page-active'))
    })
    return () => cancelAnimationFrame(t)
  }, [screen])

  const navigate = (newScreen) => setScreen(newScreen)

  const handleDeploy = (name) => {
    setPlayerName(name)
    navigate(SCREENS.LANG)
  }

  const handleLanguageLock = (lang) => {
    setChosenLanguage(lang)
    navigate(SCREENS.GAME)
  }

  const handleBugLoaded = (bug) => {
    setCurrentBug(bug)
    setPlayedBugIds(prev => [...prev, bug.id])
  }

  const handleSubmitResult = (res) => {
    setResult(res)
    navigate(SCREENS.RESULT)
  }

  const handlePlayAgain = () => {
    setResult(null)
    setCurrentBug(null)
    navigate(SCREENS.GAME)
  }

  const handleChangeLang = () => {
    setResult(null)
    setCurrentBug(null)
    navigate(SCREENS.LANG)
  }

  const handleBackHome = () => {
    setPlayerName('')
    setChosenLanguage('')
    setCurrentBug(null)
    setResult(null)
    setPlayedBugIds([])
    navigate(SCREENS.HOME)
  }

  return (
    <div className={`min-h-screen ${pageClass}`}>
      {screen === SCREENS.HOME && (
        <Home onDeploy={handleDeploy} />
      )}
      {screen === SCREENS.LANG && (
        <LanguageSelect onLock={handleLanguageLock} onBack={() => navigate(SCREENS.HOME)} />
      )}
      {screen === SCREENS.GAME && (
        <Game
          playerName={playerName}
          language={chosenLanguage}
          playedBugIds={playedBugIds}
          onBugLoaded={handleBugLoaded}
          onSubmitResult={handleSubmitResult}
          onExhausted={handleChangeLang}
        />
      )}
      {screen === SCREENS.RESULT && (
        <Result
          result={result}
          bug={currentBug}
          onPlayAgain={handlePlayAgain}
          onLeaderboard={() => navigate(SCREENS.LEADERBOARD)}
        />
      )}
      {screen === SCREENS.LEADERBOARD && (
        <Leaderboard onBack={handleBackHome} />
      )}
    </div>
  )
}

export default App
