import { CalendarDate } from "@internationalized/date";

export function calendarDateToSqliteDate(calendarDate: CalendarDate) {
  return `${calendarDate.year}-${("0" + calendarDate.month).slice(-2)}-${("0" + calendarDate.day).slice(-2)}`;
}
