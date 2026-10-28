import { scrollToTarget } from '../lib/smoothScroll'
import { resumeLink, resumeTarget, site } from '../data/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav aria-label="Footer">
          <ul>
            <li>
              <a href="#about" onClick={(e) => (e.preventDefault(), scrollToTarget('#about'))}>
                About
              </a>
            </li>
            <li>
              <a href="#work" onClick={(e) => (e.preventDefault(), scrollToTarget('#work'))}>
                Work
              </a>
            </li>
            <li>
              <a href={resumeLink} {...resumeTarget}>
                Resume
              </a>
            </li>
            <li>
              <a href="#top" onClick={(e) => (e.preventDefault(), scrollToTarget('#top'))}>
                Back to top ↑
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
