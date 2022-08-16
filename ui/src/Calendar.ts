import { Dot } from "@jswift/util";
import { toEnum } from "@jswift/util";

//        //            Calendar.current.isDate($0.dueDate ?? Date(), equalTo: Date(), toGranularity: .day)
export enum Granularity {
  era = "",
  year = "getFullYear",
  quarter = "getFullYear",
  month = "getMonth",
  weekOfYear = "",
  weekOfMonth = "",
  weekday = "",
  weekdayOrdinal = "",
  day = "getDay",
  hour = "getHours",
  minute = "getMinutes",
  second = "getSeconds",
  nanosecond = "getMilliseconds",
}

type GranularityKey = Granularity | Dot<keyof typeof Granularity>;

export class Calendar {
  static get current() {
    if (!_current) {
      _current = new Calendar();
    }
    return _current;
  }
  isDate(
    d: Date,
    equalTo = new Date(),
    toGranularity: GranularityKey = Granularity.nanosecond
  ): boolean {
    const to = toEnum(Granularity, toGranularity as any);

    for (const [gran, check] of Object.entries(Granularity)) {
      if (!check) continue;

      if (equalTo[check]() !== d[check]()) {
        return false;
      }

      if (gran === to) {
        return true;
      }
    }

    return true;
  }
}

let _current: Calendar;
