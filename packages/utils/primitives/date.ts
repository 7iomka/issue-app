import { padNumber } from './number';

export type DateDay = string;
/**
 * Adds the given years to the given date and returns the result.
 *
 * @param date
 * @param years
 */
export const addYears = (date: Date, years: number): Date => {
  return new Date(date.setFullYear(date.getFullYear() + years));
};

/**
 * Resolves the date of today and returns it in a DateDay format
 *
 * @example getTodayDate() => '2020-10-25'
 */
export const getTodayDate = (): DateDay => {
  const now = new Date();
  const day = ('0' + now.getDate()).slice(-2);
  const month = ('0' + (now.getMonth() + 1)).slice(-2);

  return now.getFullYear() + '-' + month + '-' + day;
};

/**
 * Resolves whether the first dateDay is before the second dateDay.
 *
 * @example isDateDayBefore('2020-10-25', '2020-10-26') => true
 * @example isDateDayBefore('2020-10-25', '2020-10-24') => false
 *
 * @param dateDay
 * @param dateDay2
 */
export const isDateDayBefore = (dateDay: DateDay, dateDay2: DateDay): boolean => {
  const dateTime = new Date(dateDay).getTime();
  const dateTime2 = new Date(dateDay2).getTime();

  return dateTime < dateTime2;
};

/**
 * Display a date as an i18n string.
 *
 * @example toI18nString('2020-09-16', 'fr')
 * @example toI18nString('2020-09-16', 'en-US')
 * @example toI18nString('2020-09-16', 'en-US', { weekday: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric' })
 *
 * @param dateDay
 * @param langOrLocale
 * @param options
 */
export const toI18nString = (
  dateDay: DateDay,
  langOrLocale: string = 'ru',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string => {
  const date = new Date(dateDay);
  // return `${dateRaw.getDate()} ${month}, ${dateRaw.getFullYear()}`;
  return date.toLocaleDateString(langOrLocale, options);
};

/**
 * format time dd 00:00:00
 * @param seconds seconds
 * @param len length 4:day:hour:minute:second, 3:hour:minute:second,2:minute:second,1:second
 */
export const formatTimeHMS = (seconds: number, len: number = 3): string => {
  var result: string = '';
  var hour: number = 0;
  hour = Math.floor(seconds / 3600);
  var hourTotal: number = hour;
  var day: number = 0;
  if (hour >= 24) {
    day = Math.floor(hour / 24);
    hour -= day * 24;
  }
  var minute: number = 0;
  minute = Math.floor((seconds - hourTotal * 3600) / 60);
  var second: any = Number(seconds - hourTotal * 3600 - minute * 60);
  if (day > 0) result += day + 'd ';
  else if (len > 3) result += '0d:';
  if (hour > 0) result += padNumber(hour) + ':';
  else if (len > 2) result += '00:';
  if (minute > 0) result += padNumber(minute) + ':';
  else if (len > 1) result += '00:';
  result += padNumber(second);
  return result;
};
