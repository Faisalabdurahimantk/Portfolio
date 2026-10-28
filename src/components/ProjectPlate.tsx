import type { CSSProperties } from 'react'
import type { Project } from '../data/projects'
import { sculpture } from '../data/assets'
import { SculptureImage } from './SculptureImage'
import { GoldenBirds } from './GoldenBirds'

/**
 * Project imagery. Uses the configured cover when present; otherwise draws an
 * art-directed sculptural cover from the project's motif and palette, so no
 * placeholder screenshot or invented UI is ever shown.
 */
export function ProjectPlate({ project }: { project: Project }) {
  if (project.cover) {
    return (
      <img
        className="plate plate--cover"
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        loading="lazy"
        decoding="async"
      />
    )
  }

  const style = { '--from': project.palette.from, '--to': project.palette.to } as CSSProperties

  return (
    <div className={`plate plate--${project.motif}`} style={style} role="img" aria-label={`${project.title} — sculptural cover artwork`}>
      {project.motif === 'birds' && (
        <>
          <div className="plate__sun" />
          <GoldenBirds className="plate__birds" />
        </>
      )}
      {project.motif === 'forest' && (
        <>
          <SculptureImage asset={sculpture.forestFar} className="plate__layer plate__layer--far" />
          <svg className="plate__route" viewBox="0 0 800 500" preserveAspectRatio="none">
            <path d="M-20 430 C180 400 220 300 380 300 S600 210 820 120" />
          </svg>
          <SculptureImage asset={sculpture.forestNear} className="plate__layer plate__layer--near" />
        </>
      )}
      {project.motif === 'stairs' && (
        <div className="plate__arch">
          <SculptureImage asset={sculpture.staircase} />
        </div>
      )}
      {project.motif === 'column' && (
        <>
          <div className="plate__spot" />
          <SculptureImage asset={sculpture.doricA} className="plate__column" decorative />
          <SculptureImage asset={sculpture.moss} className="plate__moss" />
        </>
      )}
      <span className="plate__mark">{project.title}</span>
    </div>
  )
}
