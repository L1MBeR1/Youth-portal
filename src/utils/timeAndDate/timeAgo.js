import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
export const timeAgo = (date) => {
  const pastDate = new Date(date);
  return formatDistanceToNow(pastDate, { addSuffix: true, locale: ru });
};
