'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'portfolio_terms_accepted_v1'

export function FirstVisitTerms() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      if (!accepted) {
        setOpen(true)
      }
    } catch {}
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={anchorRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        >
          {/* Backdrop — blocks interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
            onClick={() => {}}
          />

          {/* Modal — anchored to center of viewport, not page */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Terms & Conditions</h2>
                  <p className="text-xs text-muted-foreground">Please read before using this portfolio</p>
                </div>
              </div>
              <button
                onClick={handleAccept}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">1. Acceptance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By accessing this portfolio website, you agree to be bound by these Terms & Conditions.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">2. Purpose</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This portfolio is maintained by <strong>Abhishek Singh</strong> for professional showcase.
                  It displays information about services, projects, skills, experience, and provides a contact mechanism.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">3. Contact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When submitting messages through the contact form, you must provide accurate information
                  and not submit spam or unsolicited marketing.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">4. Prohibited Conduct</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>No unlawful, threatening, or abusive content</li>
                  <li>No spam or automated requests</li>
                  <li>No unauthorized access attempts</li>
                  <li>No impersonation or data collection of others</li>
                </ul>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">5. Intellectual Property</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All content including text, images, code, and design elements are the property of Abhishek Singh.
                  You may not copy, reproduce, or distribute without permission.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">6. AI Chatbot</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The AI chatbot is for informational purposes only and is not a formal communication or binding agreement.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">7. External Links</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  External links are provided for convenience only. Visiting them is at your own risk.
                </p>
              </section>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">8. Disclaimer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This website is provided "as is" without warranties. While we keep information accurate, no guarantee is made regarding completeness or reliability.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-secondary/30">
              <Button onClick={handleAccept} className="w-full font-medium">
                I Understand
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}