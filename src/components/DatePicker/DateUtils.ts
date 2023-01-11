/**
 * CalendarUtils
 *
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


interface IDateDetails {
  year: number;
  month: number;
  day?: number;
}


function mod(v: number, min: number, max: number): [number, number] {
  const d = max - min + 1;
  v -= min;
  const g = Math.floor(v / d);
  v = v % d;
  if (v < 0) v += d;
  return [v + min, g];
}

export class DateUtils {
  public static isYear = (p: string) => !!p.match(/^\d\d\d\d$/);
  public static isQuarter = (p: string) => !!p.match(/^\d\d\d\d-(I|II|III|IV)$/);
  public static isMonth = (p: string) => !!p.match(/^\d\d\d\d-\d\d$/);
  public static isWeek = (p: string) => !!p.match(/^\d\d\d\d-W\d\d$/);
  public static isDay = (p: string) => !!p.match(/^\d\d\d\d-\d\d-\d\d$/);
  public static makeMonth = (year: number, month: number) => String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0');
  public static makeDay = (year: number, month: number, day: number) => String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  public static makeDayFromDate = (d: Date) => DateUtils.makeDay(d.getFullYear(), d.getMonth() + 1, d.getDate());

  public static split(p: string): IDateDetails {
    // TODO: implement every case
    const year = +p.slice(0, 4), month = +p.slice(5, 7);
    const day: number | undefined = DateUtils.isDay(p) ? +p.slice(8, 10) : undefined;
    return {year, month, day};
  }

  public static make(d: Partial<IDateDetails>): string {
    // TODO: make for weeks, quarters, errors
    let result = '';
    let {year, month, day} = d;
    if (month) month = Math.max(1, Math.min(month, 12));
    if (month && day) day = Math.max(1, Math.min(day, DateUtils.getDaysInMonth(year!, month!)));

    if (d.year) result += String(year).padStart(4, '0');
    if (d.month) result += '-' + String(month).padStart(2, '0');
    if (d.day) result += '-' + String(day).padStart(2, '0');
    return result;
  }

  public static addMonths(p: string, amount: number): string {
    let s = DateUtils.split(p);
    if (DateUtils.isMonth(p)) {
      const [month, dYear] = mod(s.month + amount, 1, 12);
      s.month = month;
      s.year += dYear;
      return DateUtils.make(s);
    }
    throw new Error('addMonths not implemented');                                                    // todo
  }

  /**
   *
   * @param year
   * @param month
   * @param day
   * @return dayOfWeek - number from 1 (Monday) to 7 (Sunday)
   */
  public static getDayOfWeek(year: number, month: number, day: number): number {
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() != month - 2 || d.getDate() !== day) throw new Error('Invalid date ' + DateUtils.makeDay(year, month, day));
    return d.getDay() || 7;                                                                         // getDay returns: 0 - Sunday, 1 - Monday ... 6 - Saturday
  }

  public static getDaysInMonth(year: number, month: number): number {
    return DateUtils.isLeapYear(year) && month === 2 ? 29 : DAYS_IN_MONTH[month];
  }

  public static getWeeksOfMonth = (year: number, month: number): (string | null)[][] => {
    let d = new Date(year, month - 1, 1);
    const firstDayOfWeek = d.getDay() || 7;
    d = new Date(d.valueOf() - (firstDayOfWeek - 1) * MS_PER_DAY);                                  // now - Monday
    let result: (string | null)[][] = [];
    while (d.getFullYear() * 100 + (d.getMonth() + 1) <= year * 100 + month) {
      let week: (string | null)[] = [];
      for (let i = 0; i < 7; i++) {
        week.push((d.getFullYear() === year) && (d.getMonth() + 1 === month) ? DateUtils.makeDayFromDate(d) : null);
        d = new Date(d.valueOf() + MS_PER_DAY);
      }
      result.push(week);
    }
    return result;
  }

  public static isLeapYear = (year: number) => year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
}
