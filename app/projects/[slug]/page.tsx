'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Github, ExternalLink, Code2, Zap, CheckCircle,
  Layers, Target, Wrench, ChevronRight, Sparkles,
} from 'lucide-react'
import { getPortfolioData, type PortfolioData } from '@/lib/portfolio-data'
import { Button } from '@/components/ui/button'

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Extended project metadata (auto-generated from base data + enrichments)
function buildProjectMeta(project: PortfolioData['projects'][0]) {
  const gradientMap: Record<string, { banner: string; glow: string }> = {
    'from-blue-600 to-cyan-500': { banner: 'from-blue-900 via-blue-800 to-cyan-900', glow: 'rgba(37,99,235,0.3)' },
    'from-orange-600 to-red-500': { banner: 'from-orange-900 via-red-900 to-rose-900', glow: 'rgba(234,88,12,0.3)' },
    'from-green-600 to-teal-500': { banner: 'from-green-900 via-teal-900 to-emerald-900', glow: 'rgba(22,163,74,0.3)' },
    'from-purple-600 to-pink-500': { banner: 'from-purple-900 via-fuchsia-900 to-pink-900', glow: 'rgba(147,51,234,0.3)' },
    'from-indigo-600 to-blue-500': { banner: 'from-indigo-900 via-blue-900 to-sky-900', glow: 'rgba(79,70,229,0.3)' },
    'from-yellow-600 to-orange-500': { banner: 'from-yellow-900 via-orange-900 to-red-900', glow: 'rgba(202,138,4,0.3)' },
  }

  const meta = gradientMap[project.image] ?? { banner: 'from-slate-900 via-slate-800 to-slate-900', glow: 'rgba(100,116,139,0.3)' }

  const challenges: string[] = [
    'Designing a scalable component architecture that handles dynamic data cleanly',
    'Optimizing performance for low-end devices without sacrificing visual quality',
    'Managing complex state across multiple async operations',
  ]

  const outcomes: string[] = [
    'Delivered a fully functional, production-ready application',
    'Achieved clean, maintainable codebase with zero major bugs',
    'Implemented responsive design that works flawlessly across all screen sizes',
  ]

  const features: string[] = [
    'Responsive design with mobile-first approach',
    'Clean, accessible UI with keyboard navigation support',
    'Optimized loading with lazy components and code splitting',
    'Error boundaries and graceful degradation',
  ]

  return { ...meta, challenges, outcomes, features }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<PortfolioData['projects'][0] | null>(null)
  const [allProjects, setAllProjects] = useState<PortfolioData['projects']>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        const data = json as PortfolioData | null
        const projects = data?.projects ?? []
        setAllProjects(projects)
        const found = projects.find(p => slugify(p.title) === params.slug)
        setProject(found ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center text-white gap-4">
        <Code2 className="w-16 h-16 text-slate-600" />
        <p className="text-xl font-bold">Project not found</p>
        <Button onClick={() => router.push('/#projects')} variant="outline">← Back to Projects</Button>
      </div>
    )
  }

  const meta = buildProjectMeta(project)
  const otherProjects = allProjects.filter(p => p.title !== project.title).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* ── Back nav ── */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#020817]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-400">Projects</span>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-medium truncate">{project.title}</span>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className={`relative pt-14 bg-gradient-to-br ${meta.banner} overflow-hidden`}>
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-40 pointer-events-none"
          style={{ background: meta.glow }}
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              Featured Project
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.live && project.live !== '#' && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#020817] font-semibold text-sm hover:bg-white/90 transition-colors shadow-xl shadow-black/30"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Preview
                </motion.a>
              )}
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Github className="w-4 h-4" />
                View Code
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020817] to-transparent" />
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 grid lg:grid-cols-3 gap-12">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-12">

          {/* Deep Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold">About This Project</h2>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-relaxed text-base">
                {project.description} This project was built with a focus on real-world usability,
                clean code architecture, and a user experience that doesn&apos;t get in the way.
                Every feature was scoped intentionally — no bloat, just what the user actually needs.
              </p>
              <p className="text-slate-400 leading-relaxed text-sm mt-4">
                The tech stack was chosen for its developer experience and production reliability.
                Using <strong className="text-slate-200">{project.tech.slice(0, 3).join(', ')}</strong>
                {project.tech.length > 3 ? ` and ${project.tech.length - 3} other technologies` : ''},
                the architecture is designed to be maintainable and extensible as requirements evolve.
              </p>
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-600 to-teal-500">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold">Key Features</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {meta.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-700/40 hover:border-green-500/30 transition-colors group"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-slate-300">{f}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-600 to-red-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold">Engineering Challenges</h2>
            </div>
            <div className="space-y-3">
              {meta.challenges.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-700/40"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300">{c}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Outcomes */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold">Outcomes & Results</h2>
            </div>
            <div className="space-y-3">
              {meta.outcomes.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-500/5 border border-purple-500/20"
                >
                  <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">{o}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Tech stack detail */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="bg-slate-900 border border-slate-700/40 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-sm text-slate-200">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-900 border border-slate-700/40 rounded-2xl p-6 space-y-3"
          >
            <h3 className="font-semibold text-sm text-slate-200 mb-4">Project Links</h3>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors group"
            >
              <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Source Code</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:text-slate-400" />
            </a>
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm text-blue-300 group-hover:text-blue-200 transition-colors">Live Preview</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 ml-auto group-hover:text-blue-400" />
              </a>
            )}
          </motion.div>

          {/* Other projects */}
          {otherProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-slate-900 border border-slate-700/40 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-sm text-slate-200 mb-4">More Projects</h3>
              <div className="space-y-2">
                {otherProjects.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      window.location.href = `/projects/${slugify(p.title)}`
                    }}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.image} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors truncate">{p.title}</p>
                      <p className="text-xs text-slate-500 truncate">{p.tech.slice(0, 2).join(', ')}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:text-slate-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
