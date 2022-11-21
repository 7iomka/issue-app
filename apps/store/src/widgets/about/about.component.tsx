import React from 'react';
import clsx from 'clsx';
import xss from 'xss';
import { breakpoints, CustomLink, VideoPreview } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { aboutItems } from './about.data';
import styles from './about.module.scss';

interface AboutProps {
  className?: string;
  title?: string;
  items?: {
    id: ID;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    link: string;
  }[];
}

const About = createView<AboutProps>().view(
  ({ className, title = 'О проекте &ldquo;стекло24&rdquo;', items = aboutItems }) => (
    <div className={clsx(styles.root, className)}>
      <div className="container">
        <div className="row gx-30 gy-4 items-center">
          <div className="col-auto">
            <h2
              className={clsx('c-title', styles.title)}
              dangerouslySetInnerHTML={{ __html: xss(title) }}
            />
          </div>
          <div className="col-auto">
            <CustomLink className="text-sm" href="#!" hasChevron={false}>
              Узнать подробнее →
            </CustomLink>
          </div>
        </div>
        <div className="mt-24">
          <div className="row gy-30">
            <div className="col-12 md:col-6">
              <VideoPreview
                className="h-[200px] md:h-[320px] lg:h-full"
                posterProps={{
                  src: '/static/images/content/about/video-poster.jpg',
                  fill: true,
                  sizes: `(min-width: ${breakpoints.md}px) 50vw, 100vw`,
                }}
              />
            </div>
            <div className="col-12 md:col-6">
              <div className="row gy-22">
                {items.map((item) => (
                  <div className="col-12 xsm:col-6" key={item.id}>
                    <div className={styles.item}>
                      <item.icon className={styles.itemIcon} />
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <div className={styles.itemDescription}>{item.description}</div>
                      <CustomLink className="text-sm mt-8" href={item.link}>
                        Подробнее
                      </CustomLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);

export { About };
