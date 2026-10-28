import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, motionQueries, type MotionConditions } from '../lib/gsap'
import { sculpture } from '../data/assets'
import { mailto, resumeLink, resumeTarget, site } from '../data/site'
import { SculptureImage } from './SculptureImage'
import { RevealLines } from './RevealLines'

export function ContactSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(motionQueries, (ctx) => {
        const { reduce } = ctx.conditions as unknown as MotionConditions
        if (reduce) return
        gsap.fromTo(
          q('.contact__column'),
          { yPercent: 22 },
          { yPercent: -4, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1.2 } },
        )
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%', toggleActions: 'play none none reverse' } })
        tl.from(q('.contact__title .reveal-line > span'), { yPercent: 110, duration: 1.3, stagger: 0.1, ease: 'expo.out' })
          .from(q('.contact__sub, .contact__links > *'), { opacity: 0, y: 18, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.3)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__text">
          <p className="eyebrow">
            <span className="eyebrow__index">03</span> Contact
          </p>
          <RevealLines id="contact-title" className="contact__title display" lines={['Have a meaningful', 'problem to solve?']} />
          <p className="contact__sub">
            <em>Let’s create something thoughtful.</em>
          </p>
          <ul className="contact__links">
            <li>
              <a className="contact__email" href={mailto()}>
                {site.email}
              </a>
            </li>
            {site.linkedinUrl && (
              <li>
                <a className="contact__link" href={site.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
                </a>
              </li>
            )}
            <li>
              <a className="contact__link" href={resumeLink} {...resumeTarget}>
                {site.resumeUrl ? 'Résumé (PDF)' : 'Request résumé'} <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
        <div className="contact__visual" aria-hidden="true">
          <SculptureImage asset={sculpture.moss} className="contact__mound" />
          <SculptureImage asset={sculpture.column} className="contact__column" decorative />
        </div>
      </div>
    </section>
  )
}
