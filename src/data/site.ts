/**
 * Personal details and outbound links. Anything set to `null` is treated as
 * "not configured yet" — the UI hides it or falls back to an email request
 * rather than pointing at an invented destination.
 */
export const site = {
  name: 'Faisal Abdurahiman',
  role: 'UI/UX & Product Designer',
  experience: '4+ years',
  email: 'faisalabdurahimantk@gmail.com',
  /** e.g. 'https://www.linkedin.com/in/your-handle' */
  linkedinUrl: null as string | null,
  /** Drop a PDF into /public (e.g. /resume.pdf) and point to it here. */
  resumeUrl: null as string | null,
}

export const mailto = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

/** Résumé link: the configured PDF, or a pre-filled request email until one exists. */
export const resumeLink = site.resumeUrl ?? mailto('Résumé request')

/** Open the PDF in a new tab; a mailto fallback should stay in the current one. */
export const resumeTarget = site.resumeUrl ? { target: '_blank', rel: 'noreferrer' } : {}
