'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, Download, Instagram, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { getJourneyProfile } from '@/lib/journey-store'

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`, width: size, height: size,
        background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '37,99,235' : '6,182,212'},0.4), transparent)`,
      }}
      animate={{
        y: [0, -40 - Math.random() * 20, 0],
        x: [0, (Math.random() - 0.5) * 20, 0],
        opacity: [0.1, 0.7, 0.1],
        scale: [1, 1.4, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function FloatingOrb({ size, x, y, color, delay }: { size: number; x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-2xl"
      style={{ width: size, height: size, left: x, top: y, background: color }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15], x: [0, 20, 0], y: [0, -15, 0] }}
      transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const current = texts[idx]
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }, 60)
      return () => clearTimeout(t)
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setDisplayed(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }, 35)
      return () => clearTimeout(t)
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setIdx(i => (i + 1) % texts.length)
    }
  }, [charIdx, deleting, idx, texts])

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
      {displayed}<span className="animate-pulse border-r-2 border-blue-500 ml-0.5">&nbsp;</span>
    </span>
  )
}

// ─── Cursor glow ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div className="fixed pointer-events-none z-0 w-72 h-72 rounded-full hidden md:block"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
  )
}

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: 5 + (i * 8.5) % 90, y: 5 + (i * 13) % 85,
  size: 4 + (i % 4) * 3, delay: i * 0.35, duration: 3 + (i % 3),
}))

import { useExperienceMode } from '@/components/experience-mode'

export function Hero() {
  const { hero } = usePortfolioData()
  const { mode } = useExperienceMode()
  const [mainProfileUrl, setMainProfileUrl] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getJourneyProfile().then(p => { if (p?.mainProfileUrl) setMainProfileUrl(p.mainProfileUrl) })
  }, [])

  const initials = hero.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25,0.46,0.45,0.94] } } }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-6 overflow-hidden pt-20 md:pt-16">
      {/* Ambient BG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/3 rounded-full blur-3xl" />
      </div>
      <CursorGlow />

      <motion.div initial="hidden" animate={mounted ? "visible" : "hidden"} variants={container} className="relative z-10 max-w-4xl w-full">

        {/* Mobile: avatar + name */}
        <motion.div variants={item} className="flex items-center gap-4 mb-6 md:hidden">
          <motion.div whileHover={{ scale: 1.08, rotate: 3 }} transition={{ type:'spring', stiffness:300 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-background overflow-hidden">
              {mainProfileUrl
                ? <img src={mainProfileUrl} alt={hero.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><span className="font-bold text-lg">{initials}</span></div>}
            </div>
            {hero.available && <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:2, repeat:Infinity }}
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />}
          </motion.div>
          <div>
            {hero.available && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/60 rounded-full border border-border/50 mb-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Available</span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{hero.name}</h1>
          </div>
        </motion.div>

        {/* Desktop: availability badge */}
        {hero.available && (
          <motion.div variants={item} className="mb-4 ml-6 hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/60 rounded-full border border-border/50 backdrop-blur-sm cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-wide">Available for opportunities</span>
            </motion.div>
          </motion.div>
        )}

        {/* Desktop: avatar + heading */}
        <motion.div variants={item} className="hidden md:flex items-center gap-6 mb-6">
          <motion.div whileHover={{ scale: 1.06, rotate: 3 }} transition={{ type:'spring', stiffness:300 }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 flex-shrink-0 shadow-xl shadow-blue-500/20">
            <div className="w-full h-full rounded-full bg-background overflow-hidden">
              {mainProfileUrl
                ? <img src={mainProfileUrl} alt={hero.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><span className="font-bold text-2xl">{initials}</span></div>}
            </div>
            {hero.available && <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:2, repeat:Infinity }}
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background" />}
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{hero.name}</span>
          </h1>
        </motion.div>

        {/* Typewriter title */}
        <motion.p variants={item} className="text-lg md:text-2xl text-muted-foreground mb-4 md:mb-6 text-balance max-w-2xl min-h-[2rem]">
          <Typewriter texts={[hero.title, 'Full Stack Developer', 'DevOps Engineer', 'Problem Solver']} />
        </motion.p>

        <motion.p variants={item} className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 max-w-2xl leading-relaxed">
          {hero.subtitle}
        </motion.p>

        {/* ── Experience Mode highlight panel ── */}
        {mode && (
          <motion.div
            key={mode}
            variants={item}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 rounded-2xl border p-4 text-sm max-w-2xl ${
              mode === 'recruiter' ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300' :
              mode === 'developer' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
              'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300'
            }`}
          >
            {mode === 'recruiter' && (
              <div className="space-y-1.5">
                <p className="font-semibold text-base">👔 Recruiter Highlights</p>
                <p>✅ <strong>Open to work</strong> — available for full-time & contract roles</p>
                <p>🏆 <strong>3+ years</strong> of full-stack experience across web & cloud</p>
                <p>💼 Strong background in <strong>React, Next.js, Node.js & DevOps</strong></p>
                <p>📧 Reach out via <a href="#contact" className="underline font-medium">Contact</a> or <a href={hero.linkedin} target="_blank" rel="noopener noreferrer" className="underline font-medium">LinkedIn</a></p>
              </div>
            )}
            {mode === 'developer' && (
              <div className="space-y-1.5">
                <p className="font-semibold text-base">💻 Tech Stack Overview</p>
                <p>🔧 <strong>Frontend:</strong> React 18, Next.js 14, TypeScript, Tailwind CSS</p>
                <p>⚙️ <strong>Backend:</strong> Node.js, Express, REST & GraphQL APIs</p>
                <p>☁️ <strong>DevOps:</strong> Docker, CI/CD, Vercel, AWS basics</p>
                <p>🗄️ <strong>Databases:</strong> PostgreSQL (Neon), MongoDB, Redis</p>
                <p>📂 Browse <a href="#projects" className="underline font-medium">Projects</a> for architecture deep-dives</p>
              </div>
            )}
            {mode === 'client' && (
              <div className="space-y-1.5">
                <p className="font-semibold text-base">🤝 Working With Me</p>
                <p>🚀 <strong>Fast delivery</strong> — typical MVPs shipped in 2–4 weeks</p>
                <p>📊 <strong>Outcome-focused</strong> — clear milestones, transparent communication</p>
                <p>💡 <strong>Full ownership</strong> — from design to deployment & maintenance</p>
                <p>💬 Let's discuss your project via <a href="#contact" className="underline font-medium">Contact</a></p>
              </div>
            )}
          </motion.div>
        )}
        <motion.div variants={item} className="flex flex-wrap gap-3 mb-8 md:mb-12">
          {[
            { href:'#projects', label:'View My Work', icon:<ArrowRight className="w-4 h-4" />, primary:true },
            { href:'#contact', label:'Get In Touch', primary:false },
            { href: hero.resumeUrl || '/Cv.pdf', label:'Resume', icon:<Download className="w-4 h-4" />, primary:false, external:true },
          ].map((btn, i) => (
            <motion.div key={i} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button asChild size="lg" variant={btn.primary ? 'default' : 'outline'}
                className={`gap-2 text-sm md:text-base ${btn.primary ? 'shadow-lg shadow-blue-500/25' : ''}`}>
                <a href={btn.href} {...(btn.external ? { target:'_blank', rel:'noopener noreferrer' } : {})}>
                  {btn.icon}{btn.label}
                </a>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div variants={item} className="flex gap-5 pt-5 border-t border-border">
          {[
            { href: hero.github, icon: <Github className="w-5 h-5 md:w-6 md:h-6" />, label: 'GitHub' },
            { href: hero.linkedin, icon: <Linkedin className="w-5 h-5 md:w-6 md:h-6" />, label: 'LinkedIn' },
            { href: hero.email ? `mailto:${hero.email}` : null, icon: <Mail className="w-5 h-5 md:w-6 md:h-6" />, label: 'Email' },
            { href: hero.instagram, icon: <Instagram className="w-5 h-5 md:w-6 md:h-6" />, label: 'Instagram' },
          ].filter(s => s.href).map((s, i) => (
            <motion.a key={i} href={s.href!}
              target={s.href?.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer" aria-label={s.label}
              whileHover={{ scale: 1.35, y: -4, color: '#3b82f6' }} whileTap={{ scale: 0.9 }}
              className="text-muted-foreground transition-colors"
            >{s.icon}</motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
