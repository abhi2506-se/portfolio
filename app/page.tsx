import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Skills } from '@/components/skills'
import { Experience } from '@/components/experience'
import { Projects } from '@/components/projects'
import { ThinkingProcess } from '@/components/thinking-process'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { WhyHireMe } from '@/components/why-hire-me'
import { HireMeBar } from '@/components/hire-me-bar'
import { ATSScoreWidget } from '@/components/ats-score-widget'
import { AdminToggle } from '@/components/admin-toggle'
import { CursorSpotlight } from '@/components/cursor-spotlight'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <CursorSpotlight />
      <Navbar />

      {/* Admin floating toggle */}
      <AdminToggle />

      {/* Sticky hire funnel bar */}
      <HireMeBar />

      <Hero />

      {/* ATS Resume Score */}
      <section className="border-t border-border py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Check Resume ATS Score</h2>
            <p className="text-sm text-muted-foreground mt-1">Upload your resume and check your ATS score against Amazon, Google, Microsoft, Meta, Netflix, Infosys, TechMahindra &amp; 10+ top MNCs</p>
          </div>
          <ATSScoreWidget />
        </div>
      </section>

      <section className="border-t border-border">
        <About />
      </section>

      <section className="border-t border-border">
        <Skills />
      </section>

      <section className="border-t border-border">
        <Experience />
      </section>

      <section className="border-t border-border">
        <Projects />
      </section>

      {/* My Thinking Process — NEW */}
      <section className="border-t border-border">
        <ThinkingProcess />
      </section>

      {/* AI-powered Why Hire Me section */}
      <section className="border-t border-border">
        <WhyHireMe />
      </section>

      <section className="border-t border-border">
        <Contact />
      </section>

      <Footer />
    </main>
  )
}
