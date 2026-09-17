import type { Project } from '@/lib/data/projects';
import { Artwork } from './Artwork';

/** Generated, animated cover art for every project — used on cards, the
 * archive peek and the case-study hero. Deliberately not a screenshot: it
 * keeps the grid reading as one system regardless of what each project's
 * own UI looks like, and needs no asset per project. */
export function ProjectShot({ project }: { project: Project }) {
  return <Artwork kind={project.cover.diagram ?? 'craft'} accent={project.accent} label={project.category} />;
}
