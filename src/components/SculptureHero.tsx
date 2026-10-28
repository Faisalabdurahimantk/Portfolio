import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, ScrollTrigger, useGSAP, motionQueries, type MotionConditions } from '../lib/gsap'
import { scrollToTarget } from '../lib/smoothScroll'
import { createApproachTimeline, createStoryTimeline } from '../lib/storyTimeline'
import { sculpture } from '../data/assets'
import { site } from '../data/site'
import { FogLayers } from './FogLayers'
import { SculptureImage } from './SculptureImage'
import { StoryTransition } from './StoryTransition'

/**
 * Opening scene: a grey studio, weathered columns on a moss mound, fog.
 * Every visual is its own layer (sky, light, three fog planes, ruins, ground,
 * copy, drapery) so the entrance, the camera approach and the story
 * transition can each move them independently.
 */
export function SculptureHero() {
  const scene = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = scene.current!
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()

      mm.add(motionQueries, (ctx) => {
        const { desktop, mobile, reduce } = ctx.conditions as unknown as MotionConditions
        if (reduce) return
        const lite = mobile
        let removePointer = () => {}

        /* ---- Entrance: restrained, ~3s, never blocks interaction ---- */
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        intro
          .from(q('.hero__sky'), { opacity: 0, duration: 1.6, ease: 'power1.out' })
          .from(q('.fog-layer'), { opacity: 0, xPercent: (i) => [-10, 12, -14][i] ?? 0, duration: 2.6, stagger: 0.18 }, 0.1)
          .fromTo(
            q('.hero__ruins img'),
            { opacity: 0, scale: 1.06, filter: lite ? 'blur(10px)' : 'blur(30px)' },
            { opacity: 1, scale: 1, filter: lite ? 'blur(1.5px)' : 'blur(3px)', duration: 2.8, ease: 'power2.out', stagger: 0.2 },
            0.35,
          )
          .from(q('.hero__mound'), { yPercent: 18, duration: 2.2, ease: 'power3.out' }, 0.6)
          .fromTo(
            q('.hero__fallen'),
            { yPercent: 14, scale: 1.12, filter: 'blur(10px)', opacity: 0 },
            { yPercent: 0, scale: 1, filter: 'blur(0px)', opacity: 1, duration: 2.2 },
            1.0,
          )
          .from(q('.hero__label'), { opacity: 0, y: 14, duration: 1 }, 1.5)
          .from(q('.hero__title .reveal-line > span'), { yPercent: 110, duration: 1.5, stagger: 0.12, ease: 'expo.out' }, 1.6)
          .from(q('.hero__sub, .hero__ctas'), { opacity: 0, y: 22, duration: 1.2, stagger: 0.12 }, 2.0)
          .from(q('.hero__meta, .scroll-cue'), { opacity: 0, duration: 1.2 }, 2.4)

        // Never make visitors wait: the first scroll completes the entrance.
        ScrollTrigger.create({ trigger: el, start: 'top top-=2', once: true, onEnter: () => intro.progress(1) })

        /* ---- Ambient fog drift (slow, inner elements only) ---- */
        q('.fog').forEach((fog, i) => {
          gsap.to(fog, { xPercent: i % 2 ? -12 : 12, yPercent: i % 3 ? 4 : -4, duration: 16 + i * 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        })

        /* ---- Desktop cursor parallax on wrapper elements ---- */
        if (desktop) {
          const to = (sel: string, prop: 'x' | 'y', d: number) => gsap.quickTo(q(sel), prop, { duration: d, ease: 'power3' })
          const far = { x: to('.px-far', 'x', 1.6), y: to('.px-far', 'y', 1.6) }
          const near = { x: to('.px-near', 'x', 1.2), y: to('.px-near', 'y', 1.2) }
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5
            const ny = e.clientY / window.innerHeight - 0.5
            far.x(nx * -14)
            far.y(ny * -8)
            near.x(nx * 22)
            near.y(ny * 10)
          }
          window.addEventListener('pointermove', onMove)
          removePointer = () => window.removeEventListener('pointermove', onMove)
        }

        /* ---- Pinned story: one scrubbed master, two scene timelines ---- */
        const master = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${window.innerHeight * (lite ? 2 : 2.8)}`,
            pin: true,
            scrub: lite ? 0.6 : 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        // Approach spans the first half of the pin; the story overlaps it and
        // runs to the end, while About (pulled up by one viewport) slides over.
        master.add(createApproachTimeline(el, { lite }).duration(5), 0)
        master.add(createStoryTimeline(el, { lite }).duration(7), 3)

        return () => removePointer()
      })

      return () => mm.revert()
    },
    { scope: scene },
  )

  const go = (e: React.MouseEvent, target: string) => {
    e.preventDefault()
    scrollToTarget(target)
  }

  return (
    <section ref={scene} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__sky" aria-hidden="true" />
      <div className="hero__light" aria-hidden="true" />
      <FogLayers depth="far" />

      <div className="hero__ruins" aria-hidden="true">
        <div className="px-far">
          <SculptureImage asset={sculpture.doricB} priority className="hero__column hero__column--back" decorative />
          <SculptureImage asset={sculpture.doricA} priority className="hero__column hero__column--front" decorative />
        </div>
      </div>

      <FogLayers depth="mid" />

      <div className="hero__ground" aria-hidden="true">
        <div className="px-near">
          <SculptureImage asset={sculpture.moss} priority className="hero__mound" decorative />
          <SculptureImage asset={sculpture.fallenColumn} priority className="hero__fallen" decorative />
        </div>
      </div>

      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__copy container">
        <div className="hero__copy-inner">
          <p className="hero__label eyebrow">Independent Product Designer</p>
          <h1 className="hero__title mixed" id="hero-title" aria-label="Designing clarity in a complex world.">
            <span className="reveal-line" aria-hidden="true">
              <span>
                Designing <strong>clarity</strong>
              </span>
            </span>
            <span className="reveal-line" aria-hidden="true">
              <span>
                <em>in a complex</em> <strong>world.</strong>
              </span>
            </span>
          </h1>
          <p className="hero__sub">
            I turn complex problems into thoughtful digital experiences, blending strategy, interaction, and visual
            craft.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--solid" href="#work" onClick={(e) => go(e, '#work')}>
              Explore my work
            </a>
            <a className="btn btn--line" href="#about" onClick={(e) => go(e, '#about')}>
              About me
            </a>
          </div>
        </div>
      </div>

      <FogLayers depth="near" />
      <StoryTransition />

      <div className="hero__meta container" aria-hidden="true">
        <span>{site.name}</span>
        <span>
          {site.role} · {site.experience}
        </span>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-cue__line" />
        <ArrowDown size={14} strokeWidth={1.4} />
        <span>Scroll</span>
      </div>
    </section>
  )
}
