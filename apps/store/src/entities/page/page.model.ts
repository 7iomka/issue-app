import { attach, restore } from 'effector';
import { api } from '@/shared/api';

const getPageInfoFx = attach({ effect: api.page.pageInfo });
const $pageInfo = restore(getPageInfoFx.doneData, null);

export { $pageInfo, getPageInfoFx };
