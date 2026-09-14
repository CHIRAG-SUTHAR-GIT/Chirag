import Link from 'next/link';
import type { Project } from '@/lib/data/projects';
import { ProjectShot } from './ProjectShot';
import { IconArrow } from './icons';

export function WorkCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const live = project.links.find((l) => l.kind === 'live');
  return (
    <article className="work-card rv" data-tilt>
      <Link className="work-card__link" href={`/work/${project.slug}`} data-cursor="View">
        <div className="work-card__shot">
          <ProjectShot project={project} priority={priority} />
        </div>
        <div className="work-card__body">
          <div>
            <h3 className="work-card__title">{project.title}</h3>
            <p className="work-card__sub">{project.summary}</p>
            <p className="work-card__tag">{project.tag}</p>
          </div>
          <div className="pills">
            {live && <span className="pill pill--live">Live</span>}
            {project.confidential && <span className="pill pill--lock">Restricted</span>}
            <span className="pill">{project.category}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ArrowLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  const props = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <Link className="tlink" href={href} {...props}>
      {children} <IconArrow />
    </Link>
  );
}
