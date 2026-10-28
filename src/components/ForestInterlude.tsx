import { useRef } from 'react'
import { gsap, useGSAP, motionQueries, type MotionConditions } from '../lib/gsap'
import { sculpture } from '../data/assets'
import { SculptureImage } from './SculptureImage'
import { GoldenBirds } from './GoldenBirds'

/** Misty pine forest: the light climbs from the dark theatre back to ivory. */
export function ForestInterlude() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(motionQueries, (ctx) => {
        const { reduce } = ctx.conditions as unknown as MotionConditions
        if (reduce) return
        const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        gsap.fromTo(q('.forest__far'), { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: st })
        gsap.fromTo(q('.forest__mid'), { yPercent: 6 }, { yPercent: -10, ease: 'none', scrollTrigger: st })
        gsap.fromTo(q('.forest__near'), { yPercent: 16 }, { yPercent: -14, ease: 'none', scrollTrigger: st })
        gsap.fromTo(q('.forest__birds'), { xPercent: -120, yPercent: 40 }, { xPercent: 140, yPercent: -60, ease: 'none', scrollTrigger: st })
        gsap.from(q('.forest__line'), {
          opacity: 0,
          y: 30,
          filter: 'blur(8px)',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.forest__line')[0], start: 'top 80%', toggleActions: 'play none none reverse' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="forest" aria-label="Interlude">
      <p className="forest__line">
        Clarity arrives slowly —<br />
        <em>then all at once.</em>
      </p>
      <GoldenBirds className="forest__birds" />
      <div className="forest__layers" aria-hidden="true">
        <SculptureImage asset={sculpture.forestFar} className="forest__far" />
        <div className="forest__mist forest__mist--1" />
        <SculptureImage asset={sculpture.forestMid} className="forest__mid" />
        <div className="forest__mist forest__mist--2" />
        <SculptureImage asset={sculpture.forestNear} className="forest__near" />
        <div className="forest__mist forest__mist--3" />
      </div>
    </section>
  )
}
