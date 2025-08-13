// /lib/date.js
export const localISODate = (d = new Date()) => {
  // yyyy-mm-dd in *local* time (not UTC) so your day logic matches Greece time zone
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
};

export const isToday = (dateStr) => dateStr === localISODate();
