import { useRef } from 'react'
import { gsap, useGSAP, motionQueries, type MotionConditions } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { sculpture } from '../data/assets'
import { site } from '../data/site'
import { RevealLines } from './RevealLines'
import { SculptureImage } from './SculptureImage'
import { GoldenBirds } from './GoldenBirds'
import { StoryStatic } from './StoryTransition'

const CAPABILITIES = [
  'Product strategy and problem framing',
  'UX research and information architecture',
  'User flows and interaction design',
  'High-fidelity UI and prototyping',
  'Design systems and developer handoff',
]

export function AboutSection() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(motionQueries, (ctx) => {
        const { mobile, reduce } = ctx.conditions as unknown as MotionConditions
        if (reduce) return

        // The drapery edge billows as it rises over the hero; clouds part.
        const rise = { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true }
        gsap.fromTo(q('.about__drape-cloth'), { scaleY: 1.25 }, { scaleY: 1, ease: 'none', scrollTrigger: rise })
        gsap.fromTo(q('.about__cloud--a'), { xPercent: -20 }, { xPercent: 14, ease: 'none', scrollTrigger: rise })
        gsap.fromTo(q('.about__cloud--b'), { xPercent: 20 }, { xPercent: -12, ease: 'none', scrollTrigger: rise })

        // Heading lines + copy: played once per pass, so reading is never scrubbed.
        gsap.from(q('.about__title .reveal-line > span'), {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.about__title')[0], start: 'top 80%', toggleActions: 'play none none reverse' },
        })
        gsap.from(q('.about__intro > *'), {
          opacity: 0,
          y: 26,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.about__intro')[0], start: 'top 82%', toggleActions: 'play none none reverse' },
        })
        gsap.from(q('.capability'), {
          opacity: 0,
          x: -18,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.capabilities')[0], start: 'top 82%', toggleActions: 'play none none reverse' },
        })

        // Sculptural composition: arch mask opens, architecture drifts slower
        // than the page, fabric and birds move across it.
        gsap.fromTo(
          q('.about__arch'),
          { clipPath: 'inset(30% 8% 0% 8%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top 90%', end: 'top 30%', scrub: 1 } },
        )
        gsap.fromTo(
          q('.about__arch img'),
          { yPercent: -10, scale: 1.2 },
          { yPercent: 6, scale: 1.05, ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        if (!mobile) {
          gsap.fromTo(
            q('.about__fabric'),
            { yPercent: 40, rotate: -14 },
            { yPercent: -40, rotate: -6, ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top bottom', end: 'bottom top', scrub: 1.4 } },
          )
          gsap.fromTo(
            q('.about__bust'),
            { yPercent: 18 },
            { yPercent: -12, ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top bottom', end: 'bottom top', scrub: 1 } },
          )
        }
        gsap.fromTo(
          q('.about__birds'),
          { xPercent: -60, yPercent: 30 },
          { xPercent: 80, yPercent: -40, ease: 'none', scrollTrigger: { trigger: q('.about__visual')[0], start: 'top bottom', end: 'bottom top', scrub: 1.5 } },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="about" id="about" aria-labelledby="about-title">
      <div className="about__drape" aria-hidden="true">
        <SculptureImage asset={sculpture.drapery} className="about__drape-cloth" priority />
        <SculptureImage asset={sculpture.cloudA} className="about__cloud about__cloud--a" />
        <SculptureImage asset={sculpture.cloudB} className="about__cloud about__cloud--b" />
      </div>

      <div className="container about__grid">
        <div className="about__text">
          <p className="eyebrow">
            <span className="eyebrow__index">01</span> The person behind the pixels
          </p>
          {reduced && <StoryStatic />}
          <RevealLines
            id="about-title"
            className="about__title display"
            lines={['Behind every interface,', 'there’s a human story.']}
          />
          <div className="about__intro">
            <p className="lede">
              I’m Faisal, a UI/UX and Product Designer who enjoys turning complex problems into simple, meaningful
              experiences.
            </p>
            <p>
              I work across research, user flows, wireframes, prototypes, and design systems to help ideas become
              products people can actually use.
            </p>
            <p className="about__years">
              <span className="about__years-num">{site.experience}</span> designing digital products
            </p>
          </div>

          <div className="capabilities">
            <h3 className="eyebrow">Capabilities</h3>
            <ol>
              {CAPABILITIES.map((c, i) => (
                <li className="capability" key={c}>
                  <span className="capability__index">{String(i + 1).padStart(2, '0')}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="about__visual" aria-hidden="true">
          <div className="about__arch">
            <SculptureImage asset={sculpture.staircase} decorative />
          </div>
          <SculptureImage asset={sculpture.drapery} className="about__fabric" />
          <SculptureImage asset={sculpture.bust} className="about__bust" decorative />
          <GoldenBirds className="about__birds" count={5} />
        </div>
      </div>
    </section>
  )
}
