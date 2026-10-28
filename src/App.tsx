import { useEffect } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { initSmoothScroll } from './lib/smoothScroll'
import { Navigation } from './components/Navigation'
import { SculptureHero } from './components/SculptureHero'
import { AboutSection } from './components/AboutSection'
import { ProjectShowcase } from './components/ProjectShowcase'
import { ForestInterlude } from './components/ForestInterlude'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'

export default function App() {
  useEffect(() => {
    const destroy = initSmoothScroll()
    // Fonts and lazy images change layout; re-measure every trigger after them.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      destroy()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <Navigation />
      <main id="main">
        <SculptureHero />
        <AboutSection />
        <ProjectShowcase />
        <ForestInterlude />
        <ContactSection />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
