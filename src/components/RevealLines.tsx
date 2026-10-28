import type { ElementType, ReactNode } from 'react'

interface RevealLinesProps {
  lines: ReactNode[]
  /** Plain-text label for assistive tech when lines contain markup. */
  label?: string
  as?: ElementType
  className?: string
  id?: string
}

/**
 * Renders a headline as masked lines (`.reveal-line > span`) so scenes can
 * slide each line up from behind its own mask. Screen readers get one string.
 */
export function RevealLines({ lines, label, as: Tag = 'h2', className, id }: RevealLinesProps) {
  return (
    <Tag className={className} id={id} aria-label={label ?? lines.join(' ')}>
      {lines.map((line, i) => (
        <span className="reveal-line" key={i} aria-hidden="true">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
