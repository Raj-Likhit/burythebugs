import { useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useGameStore, SCREENS } from './store/useGameStore'
import Home from './pages/Home'

const LanguageSelect = lazy(() => import('./pages/LanguageSelect'))
const Game = lazy(() => import('./pages/Game'))
const Result = lazy(() => import('./pages/Result'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))

function ScreenFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
       <Loader2 className="animate-spin text-accent-green" size={48} />
    </div>
  )
}

function App() {
  const { screen, setPlayedBugIds } = useGameStore()

  useEffect(() => {
    // Session is now persistent via Zustand.
  }, [])

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="min-h-screen app-bg text-primary overflow-hidden relative">
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
          <Suspense fallback={<ScreenFallback />}>
            {screen === SCREENS.HOME && <Home />}
            {screen === SCREENS.LANG && <LanguageSelect />}
            {screen === SCREENS.GAME && <Game />}
            {screen === SCREENS.RESULT && <Result />}
            {screen === SCREENS.LEADERBOARD && <Leaderboard />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
