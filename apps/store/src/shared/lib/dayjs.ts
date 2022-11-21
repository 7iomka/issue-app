import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
// import dayjsBusinessDays from 'dayjs-business-days';

require('dayjs/locale/ru');

dayjs.locale('ru');
dayjs.extend(relativeTime);
// dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
