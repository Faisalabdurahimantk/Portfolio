import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ScrollTrigger } from '../lib/gsap'
import { scrollToTarget } from '../lib/smoothScroll'
import { resumeLink, resumeTarget, site } from '../data/site'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

/**
 * Fixed, minimal navigation. Active section and light/dark treatment come
 * from ScrollTriggers that only touch React state when they toggle — never
 * per frame.
 */
export function Navigation() {
  const [active, setActive] = useState<SectionId | null>(null)
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const triggers: ScrollTrigger[] = []
    // Wait a frame so the scenes' pins exist before measuring.
    const raf = requestAnimationFrame(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && setActive(id),
            onLeaveBack: () => id === 'about' && setActive(null),
          }),
        )
      })
      document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]').forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 40px',
            end: 'bottom 40px',
            onToggle: (self) => setDark(self.isActive),
          }),
        )
      })
      triggers.push(
        ScrollTrigger.create({ start: 80, end: 'max', onToggle: (self) => setScrolled(self.isActive) }),
      )
      ScrollTrigger.refresh()
    })
    return () => {
      cancelAnimationFrame(raf)
      triggers.forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const go = (e: React.MouseEvent, target: string) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(target)
  }

  const links = (
    <>
      {SECTIONS.map(({ id, label }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={`nav__link ${active === id ? 'is-active' : ''}`}
            aria-current={active === id ? 'location' : undefined}
            onClick={(e) => go(e, `#${id}`)}
          >
            {label}
          </a>
        </li>
      ))}
      <li>
        <a className="nav__link" href={resumeLink} {...resumeTarget}>
          Resume
        </a>
      </li>
    </>
  )

  return (
    <header className={`nav ${dark ? 'nav--dark' : ''} ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="nav__inner container" aria-label="Primary">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, '#top')}>
          {site.name.toUpperCase()}
        </a>
        <ul className="nav__links">{links}</ul>
        <button
          ref={menuButton}
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
        </button>
      </nav>
      <div className="nav__sheet" id="mobile-menu" hidden={!open}>
        <ul>{links}</ul>
        <p className="nav__sheet-foot">{site.role}</p>
      </div>
    </header>
  )
}
