import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { mailto } from '../data/site'
import { ProjectPlate } from './ProjectPlate'

interface ProjectItemProps {
  project: Project
  index: number
}

export function ProjectItem({ project, index }: ProjectItemProps) {
  const number = String(index + 1).padStart(2, '0')
  const hasCaseStudy = Boolean(project.caseStudyUrl)
  const href = project.caseStudyUrl ?? mailto(`Case study request: ${project.title}`)
  const external = { target: '_blank', rel: 'noreferrer' }

  return (
    <article className={`project project--${project.layout}`} aria-labelledby={`project-${project.id}`}>
      <span className="project__number" aria-hidden="true">
        {number}
      </span>

      <a className="project__media" href={href} {...(hasCaseStudy ? external : {})} tabIndex={-1} aria-hidden="true">
        <div className="project__image">
          <ProjectPlate project={project} />
        </div>
      </a>

      <div className="project__body">
        <p className="project__meta">
          <span>{project.category}</span>
          {project.role && <span>{project.role}</span>}
          {project.year && <span>{project.year}</span>}
        </p>
        <h3 className="project__title mixed" id={`project-${project.id}`}>
          <span className="reveal-line">
            <span>{project.title}</span>
          </span>
        </h3>
        <p className="project__summary">{project.summary}</p>
        <ul className="project__focus" aria-label="Focus areas">
          {project.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <a className="project__link" href={href} {...(hasCaseStudy ? external : {})}>
          <span>{hasCaseStudy ? 'View case study' : 'Request case study'}</span>
          <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
