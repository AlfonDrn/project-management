import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const TZ_ASIA_JAKARTA = 'Asia/Jakarta';

const datetime = {
  format(dateValue, format = 'DD/MM/YYYY') {
    return dayjs(dateValue).tz(TZ_ASIA_JAKARTA).format(format);
  },
  getIsoString(dateValue) {
    return dayjs(dateValue).tz(TZ_ASIA_JAKARTA).toISOString();
  },
  getDurationDays(startDate, endDate) {
    const start = dayjs(startDate).tz(TZ_ASIA_JAKARTA);
    const end = dayjs(endDate).tz(TZ_ASIA_JAKARTA);
    return end.diff(start, 'day') + 1;
  },
  getNow() {
    return dayjs();
  },
  isSameOrAfter(startDate, endDate) {
    return dayjs(startDate).isSameOrAfter(dayjs(endDate));
  },
  getDiff(startDate, endDate) {
    return dayjs(startDate).diff(dayjs(endDate), 'days');
  },
};

export default datetime;
