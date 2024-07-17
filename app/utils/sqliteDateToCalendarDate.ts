import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export function sqliteDateToCalendarDate(sqliteDate: string) {
  const segments = sqliteDate.split("-");
  const year = z.coerce.number().parse(segments[0]);
  const month = z.coerce.number().parse(segments[1]);
  const day = z.coerce.number().parse(segments[2]);

  return new CalendarDate(year, month, day);
}
