import {Dot} from './types';
import { toEnum, toValue } from './utilit';

//        //            Calendar.current.isDate($0.dueDate ?? Date(), equalTo: Date(), toGranularity: .day)
export enum Granularity {
    era,
    year,
    quarter,
    month, 
    weekOfYear,
    weekOfMonth,
    weekday,
    weekdayOrdinal,
    day,
    hour, 
    minute,
    second,
    nanosecond,

}
type GranularityKey = Granularity | Dot<keyof typeof Granularity>

const GranularityMap = new Map<GranularityKey, 'getFullYear' | 'getMonth' | 'getDay' | 'getHours' | 'getMinutes' | 'getSeconds' |'getMilliseconds'>([
    [Granularity.year,  'getFullYear'],
    [Granularity.month,  'getMonth'],
    [Granularity.day,  'getDay'],
    [Granularity.hour,  'getHours'],
    [Granularity.minute,  'getMinutes'],
    [Granularity.second,  'getSeconds'],
    [Granularity.nanosecond, 'getMilliseconds']
]);


export class Calendar {
    static get current(){
        if (!_current){
            _current = new Calendar;
        }
        return _current;
    }
    isDate(d:Date, equalTo = new Date, toGranularity:GranularityKey = Granularity.nanosecond):boolean{
        const to = toEnum(Granularity, toGranularity as any);

        for(const [gran, check] of GranularityMap){
            if (equalTo[check]() !== d[check]()){
                    return false;
             }
            if (gran === to){
                return true;
            }
        }
        return true;
    }
}

let _current:Calendar;