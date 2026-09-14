import Image from 'next/image';
import type { Project } from '@/lib/data/projects';
import { Artwork } from './Artwork';

function hostFor(p: Project) {
  const live = p.links.find((l) => l.kind === 'live');
  if (!live) return p.slug;
  return live.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** The browser-chrome-wrapped screenshot, or the generated diagram for
 * projects with no public screenshot. Used on cards and case-study pages. */
export function ProjectShot({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (!project.cover.src) {
    return <Artwork kind={project.cover.diagram ?? 'craft'} accent={project.accent} label={project.category} />;
  }
  return (
    <div className="chrome">
      <span className="chrome__dots">
        <i />
        <i />
        <i />
      </span>
      <span className="chrome__url">{hostFor(project)}</span>
      <Image
        src={`/assets/img/work/${project.cover.src}.webp`}
        alt={project.cover.alt}
        width={project.cover.w}
        height={project.cover.h}
        sizes="(max-width: 950px) 100vw, 60vw"
        priority={priority}
      />
    </div>
  );
}
