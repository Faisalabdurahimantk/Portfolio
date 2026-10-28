import { useRef } from 'react'
import { gsap, useGSAP, motionQueries, type MotionConditions } from '../lib/gsap'
import { projects } from '../data/projects'
import { sculpture } from '../data/assets'
import { SculptureImage } from './SculptureImage'
import { RevealLines } from './RevealLines'
import { ProjectItem } from './ProjectItem'

/**
 * Work: a dark theatre opening (statue in a spotlight, briefly pinned on
 * larger screens) followed by four editorial project compositions, each with
 * its own reveal timeline.
 */
export function ProjectShowcase() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(motionQueries, (ctx) => {
        const { mobile, reduce } = ctx.conditions as unknown as MotionConditions
        if (reduce) return

        /* ---- Theatre scene ---- */
        const theatre = q('.theatre')[0]
        const stage = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: theatre,
            start: mobile ? 'top 70%' : 'top top',
            end: () => (mobile ? 'bottom 60%' : `+=${window.innerHeight * 1.1}`),
            pin: !mobile,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        stage
          .fromTo(q('.theatre__spot'), { opacity: 0, scaleX: 0.35 }, { opacity: 1, scaleX: 1, duration: 1 }, 0)
          .fromTo(q('.theatre__statue'), { yPercent: 18, filter: 'brightness(0.25)' }, { yPercent: 0, filter: 'brightness(1)', duration: 1.2 }, 0)
          .fromTo(q('.theatre__floor'), { opacity: 0 }, { opacity: 1, duration: 1 }, 0.2)
          .from(q('.theatre__title .reveal-line > span'), { yPercent: 110, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.35)
          .from(q('.theatre__sub'), { opacity: 0, y: 20, duration: 0.5 }, 0.7)

        /* ---- Projects: one timeline per item ---- */
        q('.project').forEach((item) => {
          const p = gsap.utils.selector(item)
          gsap.fromTo(
            p('.project__media'),
            { clipPath: 'inset(16% 14% 16% 14%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 88%', end: 'top 30%', scrub: 1 } },
          )
          // Imagery travels slower than the page and settles in scale.
          gsap.fromTo(
            p('.project__image'),
            { yPercent: -8, scale: 1.22 },
            { yPercent: 8, scale: 1.02, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
          gsap.fromTo(
            p('.project__number'),
            { yPercent: 50 },
            { yPercent: -50, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.2 } },
          )
          const text = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: p('.project__body')[0], start: 'top 85%', toggleActions: 'play none none reverse' },
          })
          text
            .from(p('.project__meta'), { opacity: 0, y: 14, duration: 0.8 })
            .from(p('.project__title .reveal-line > span'), { yPercent: 110, duration: 1.2, ease: 'expo.out' }, 0.05)
            .from(p('.project__summary, .project__focus, .project__link'), { opacity: 0, y: 20, duration: 0.9, stagger: 0.08 }, 0.25)
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="work" id="work" data-nav-theme="dark" aria-labelledby="work-title">
      <div className="theatre">
        <div className="theatre__spot" aria-hidden="true" />
        <div className="theatre__floor" aria-hidden="true" />
        <SculptureImage asset={sculpture.bust} className="theatre__statue" decorative />
        <div className="theatre__copy container">
          <p className="eyebrow">
            <span className="eyebrow__index">02</span> Selected work
          </p>
          <RevealLines
            as="h2"
            id="work-title"
            className="theatre__title mixed"
            label="Four complex problems, made clear."
            lines={[
              <>
                Four <strong>complex</strong>
              </>,
              <>
                <em>problems, made</em> <strong>clear.</strong>
              </>,
            ]}
          />
          <p className="theatre__sub">Fintech, mobility, investment onboarding and leadership — each one a different kind of fog.</p>
        </div>
      </div>
      <div className="projects container">
        {projects.map((project, i) => (
          <ProjectItem project={project} index={i} key={project.id} />
        ))}
      </div>
    </section>
  )
}
