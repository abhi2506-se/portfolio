'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hidden, setHidden] = useState(true)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { damping: 28, stiffness: 700, mass: 0.4 }
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 900, mass: 0.2 })
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 900, mass: 0.2 })
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
    setHidden(false)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => setHidden(true), [])
  const handleMouseEnter = useCallback(() => setHidden(false), [])
  const handleMouseDown = useCallback(() => setClicking(true), [])
  const handleMouseUp = useCallback(() => setClicking(false), [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // Detect hoverable elements
    const addListeners = () => {
      const els = document.querySelectorAll('a, button, [data-cursor="pointer"], input, textarea, [role="button"]')
      els.forEach(el => {
        el.addEventListener('mouseenter', () => setHovering(true))
        el.addEventListener('mouseleave', () => setHovering(false))
      })
    }
    addListeners()

    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      observer.disconnect()
    }
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, handleMouseDown, handleMouseUp])

  // Only show on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: clicking ? 0.6 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.1 } }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-blue-500 pointer-events-none z-[9998] mix-blend-difference"
      />

      {/* Ring */}
      <motion.div
        ref={cursorRef}
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: hidden ? 0 : 0.6,
          scale: hovering ? 2.2 : clicking ? 0.8 : 1,
          borderColor: hovering ? 'rgb(59,130,246)' : 'rgba(255,255,255,0.5)',
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: 'spring', stiffness: 500, damping: 28 },
          borderColor: { duration: 0.2 },
        }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 pointer-events-none z-[9997]"
      />
    </>
  )
}
