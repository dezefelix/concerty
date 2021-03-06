import * as moment from 'moment';

export class DateHelper {

  static getPrettyDate(date: Date): string {
    moment.locale('nl');
    return moment(date).format('LL');
  }

  static getPrettyDaysRemaining(date: Date, concertDuration = 180): string {
    const minutesRemaining = DateHelper.getMinutesRemaining(date);
    const daysRemaining = Math.round(DateHelper.toDays(minutesRemaining));

    switch(true) {
      case (minutesRemaining + concertDuration < 0): return 'ENDED';
      case (minutesRemaining < 0): return 'HAPPENING';
      case (daysRemaining === 0): return 'TOMORROW';
      default: return `IN ${daysRemaining} DAYS`;
    }
  }

  static isRecentlyAdded(date: Date, recentlyAddedThreshold = 7): boolean {
    const diff = moment().diff(date, 'days');
    return diff < recentlyAddedThreshold;
  }

  static isUpcoming(date: Date): boolean {
    return moment().isSameOrBefore(date);
  }

  private static getMinutesRemaining(date: Date): number {
    return moment(date).diff(moment(), 'minutes');
  }

  private static toDays(minutes: number): number {
    return minutes / (60 * 24)
  }
}
