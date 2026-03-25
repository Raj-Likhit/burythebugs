import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import LanguageSelect from './pages/LanguageSelect'
import Game from './pages/Game'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'

const SCREENS = { HOME: 'home', LANG: 'lang', GAME: 'game', RESULT: 'result', LEADERBOARD: 'leaderboard' }

function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)
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

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen bg-[#080B0F] text-[#E6EDF3] overflow-hidden relative">
      {/* Scanline Overlay */}
      <div className="scanlines"></div>
 
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-screen w-full relative z-10"
        >
          {screen === SCREENS.HOME && (
            <Home onDeploy={handleDeploy} onViewLeaderboard={() => navigate(SCREENS.LEADERBOARD)} />
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
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
