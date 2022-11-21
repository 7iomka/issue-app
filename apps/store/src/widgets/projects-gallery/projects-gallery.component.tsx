import clsx from 'clsx';
import xss from 'xss';
import type { GalleryProps } from '@/shared/ui';
import { Gallery } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { data as _data } from './projects-gallery.data';
import styles from './projects-gallery.module.scss';

interface ProjectsGalleryProps {
  className?: string;
  title?: string;
  data?: GalleryProps['data'];
}

const ProjectsGallery = createView<ProjectsGalleryProps>()
  .displayName('ProjectsGallery')
  .memo()
  .view(({ className, title = 'Галлерея проектов', data = _data }) => (
    <div className={clsx(styles.ProjectsGallery, className)}>
      <div className="container">
        <h2 className="c-title" dangerouslySetInnerHTML={{ __html: xss(title) }} />
        <Gallery data={data} className="mt-24" />
      </div>
    </div>
  )).Memo;

export { ProjectsGallery };
