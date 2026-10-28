/**
 * Selected work. Edit freely — the showcase renders whatever is in this list.
 *
 * - `caseStudyUrl`: set to a real URL when a case study is published. While it
 *   is `null` the link becomes a pre-filled "Request case study" email.
 * - `cover`: set to a real screenshot/hero image. While it is undefined, an
 *   art-directed sculptural cover is drawn from `motif` + `palette`.
 * - `role` / `year`: optional; only rendered when provided.
 */
export type ProjectMotif = 'birds' | 'forest' | 'stairs' | 'column'
export type ProjectLayout = 'media-right' | 'media-left' | 'wide' | 'offset'

export interface Project {
  id: string
  title: string
  category: string
  summary: string
  focus: string[]
  role?: string
  year?: string
  caseStudyUrl: string | null
  cover?: { src: string; alt: string; width: number; height: number }
  motif: ProjectMotif
  palette: { from: string; to: string }
  layout: ProjectLayout
}

export const projects: Project[] = [
  {
    id: 'finbee',
    title: 'Finbee',
    category: 'Personal Finance / Fintech',
    summary:
      'Making personal finance feel approachable — financial planning, savings goals, spending insights and investing, translated into flows people can genuinely understand.',
    focus: ['Financial planning', 'Savings goals', 'Spending insights', 'Investing'],
    caseStudyUrl: null,
    motif: 'birds',
    palette: { from: '#DADBD7', to: '#8E9292' },
    layout: 'media-right',
  },
  {
    id: 'chargemod',
    title: 'chargeMOD',
    category: 'EV Charging / Mobility',
    summary:
      'The EV charging journey end to end — discovering a charger, navigating to it and reading each session clearly, so drivers face less uncertainty at every step.',
    focus: ['Charger discovery', 'Navigation', 'Charging information', 'Journey clarity'],
    caseStudyUrl: null,
    motif: 'forest',
    palette: { from: '#B9D6DE', to: '#2E3B3D' },
    layout: 'media-left',
  },
  {
    id: 'mint-it',
    title: 'MINT IT',
    category: 'Fintech / Investment Onboarding',
    summary:
      'Simplifying mutual fund onboarding — KYC requirements, verification steps and investment registration, reshaped into a calm, guided sequence.',
    focus: ['Onboarding', 'KYC requirements', 'Verification', 'Registration'],
    caseStudyUrl: null,
    motif: 'stairs',
    palette: { from: '#E3E6E0', to: '#AEB8A8' },
    layout: 'wide',
  },
  {
    id: 'qlc-qatar',
    title: 'QLC Qatar',
    category: 'Leadership / Digital Experience',
    summary:
      'A premium digital experience for a leadership organisation, built on clear information architecture, deliberate visual hierarchy and a refined brand expression.',
    focus: ['Information architecture', 'Visual hierarchy', 'Brand expression'],
    caseStudyUrl: null,
    motif: 'column',
    palette: { from: '#A3A7A7', to: '#5E6264' },
    layout: 'offset',
  },
]
