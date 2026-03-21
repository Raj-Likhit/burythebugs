import { useState, useEffect, useRef, useCallback } from 'react'

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

  // Expose stop method through ref
  useEffect(() => {
    if (window.__timerStop) window.__timerStop = stop
  }, [stop])
  window.__timerStop = stop

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  let colorClass = 'text-accent-green'
  let pulseClass = ''
  if (timeLeft <= 60) {
    colorClass = 'text-accent-red'
    pulseClass = 'timer-critical'
  } else if (timeLeft <= 120) {
    colorClass = 'text-accent-amber'
  }

  return (
    <span className={`font-mono font-bold text-xl ${colorClass} ${pulseClass}`}>
      {display}
    </span>
  )
}
