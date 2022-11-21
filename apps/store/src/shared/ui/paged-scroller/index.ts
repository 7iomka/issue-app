import { PagedScrollerItem } from './paged-scroller-item.component';
import { PagedScroller as PagedScrollerBase } from './paged-scroller.component';

// See: https://react-typescript-cheatsheet.netlify.app/docs/advanced/misc_concerns/#namespaced-components
export const PagedScroller = Object.assign(PagedScrollerBase, {
  Item: PagedScrollerItem,
});
