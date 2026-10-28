import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Shared gsap.matchMedia() conditions. Every scene builds its motion inside
 * these so reduced-motion and small screens get simpler (or no) animation,
 * and everything is reverted automatically when the query stops matching.
 */
export const motionQueries = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  reduce: '(prefers-reduced-motion: reduce)',
}

export interface MotionConditions {
  desktop: boolean
  tablet: boolean
  mobile: boolean
  reduce: boolean
}

export { gsap, ScrollTrigger, useGSAP }
