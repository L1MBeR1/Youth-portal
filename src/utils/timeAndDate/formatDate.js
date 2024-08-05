import { format, isBefore, parseISO, subYears } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(isoString) {
  const date = parseISO(isoString);
  const now = new Date();
  const oneYearAgo = subYears(now, 1);

  if (isBefore(date, oneYearAgo)) {
    return format(date, 'd MMMM yyyy', { locale: ru }); 
  } else {
    return format(date, 'd MMMM', { locale: ru }); 
  }
}

