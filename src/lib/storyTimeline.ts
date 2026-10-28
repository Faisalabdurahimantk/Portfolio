import { gsap } from './gsap'

/**
 * Scene 1 — camera approach. The foreground ground plane passes the camera
 * fastest, the ruins come into focus and grow, the fog parts.
 * Returned un-attached; the hero nests it in its pinned master timeline.
 */
export function createApproachTimeline(scene: HTMLElement, opts: { lite: boolean }) {
  const q = gsap.utils.selector(scene)
  const tl = gsap.timeline({ defaults: { ease: 'none', duration: 1 } })
  tl.addLabel('lift')
    .to(q('.hero__copy'), { yPercent: -30, autoAlpha: 0, duration: 0.6 }, 'lift')
    .to(q('.hero__meta, .scroll-cue'), { autoAlpha: 0, duration: 0.25 }, 'lift')
    .to(q('.hero__ground'), { yPercent: 38, scale: 1.25 }, 'lift')
    .to(q('.hero__ruins'), { scale: opts.lite ? 1.35 : 1.75, xPercent: opts.lite ? 0 : 10, yPercent: 14 }, 'lift')
    .to(q('.hero__ruins img'), { filter: 'blur(0px)' }, 'lift')
    .to(q('.fog-layer--far'), { xPercent: -22, yPercent: -4 }, 'lift')
    .to(q('.fog-layer--mid'), { xPercent: 18 }, 'lift')
    .to(q('.fog-layer--near'), { xPercent: 30, yPercent: -10, opacity: 0.5 }, 'lift')
  return tl
}

/**
 * Scene 2 — story transition. Studio grey lifts into chalk-white light and
 * two editorial lines surface and dissolve while the About section, led by
 * its drapery, slides up over the pinned stage.
 */
export function createStoryTimeline(scene: HTMLElement, opts: { lite: boolean }) {
  const q = gsap.utils.selector(scene)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })

  tl.addLabel('light')
    .to(q('.hero__light'), { opacity: 1, duration: 3 }, 'light')
    .to(q('.fog-layer--far, .fog-layer--mid'), { opacity: 0.35, duration: 3 }, 'light')

  q('.story-line').forEach((line, i) => {
    const at = 0.4 + i * 1.6
    tl.fromTo(
      line,
      { autoAlpha: 0, yPercent: 40, filter: opts.lite ? 'none' : 'blur(12px)' },
      { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
      at,
    ).to(
      line,
      { autoAlpha: 0, yPercent: -30, filter: opts.lite ? 'none' : 'blur(10px)', duration: 0.6, ease: 'power2.in' },
      at + 1.05,
    )
  })

  // The About section (and its drapery edge) slides over the stage from
  // here; the ruins recede beneath it.
  tl.addLabel('recede', 2.6).to(q('.hero__ruins'), { yPercent: '-=10', opacity: 0.3, duration: 2 }, 'recede')

  return tl
}
