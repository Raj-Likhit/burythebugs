import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Check } from "lucide-react"

export default function Timer({ duration = 300, onTimeout, isRunning = true }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const intervalRef = useRef(null)
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => { onTimeoutRef.current = onTimeout }, [onTimeout])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onTimeoutRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    return timeLeft
  }, [timeLeft])

  useEffect(() => {
    window.__timerStop = stop
  }, [stop])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const isCritical = timeLeft <= 60
  const isWarning = timeLeft <= 120 && !isCritical
  const isGlitching = timeLeft <= 30

  return (
    <motion.span 
      animate={isCritical ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] } : {}}
      transition={isCritical ? { repeat: Infinity, duration: 1 } : {}}
      className={`font-mono font-black text-lg tabular-nums tracking-wider 
        ${isCritical ? 'text-[#FF3B3B] glow-text-red' : isWarning ? 'text-[#FFB800]' : 'text-[#8B949E]'}
        ${isGlitching ? 'animate-glitch-slow' : ''}`}
    >
      {display}
    </motion.span>
  )
}
