import { HOURS_IN_DAY, INFINITY_SYMB, MILLISECONDS_IN_SECOND, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from './values/consts'

export default class TimeUtils {
    private static _nameToNumber = {
        'с': MILLISECONDS_IN_SECOND,
        'м': SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
        'ч': MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
        'д': HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
    }

    private static _minTime = 30_000
    private static _maxTime = 366 * this._nameToNumber['д']

    static parseTimeToMilliseconds(time: string): number {
        if(time == 'навсегда') return 0

        let date = ''
        let dateNumber = 0

        for (const symb of time) {
            if(!isNaN(+symb) || symb === '.') {
                date += symb
            }
            //@ts-ignore
            else if(this._nameToNumber[symb]) {
                //@ts-ignore
                dateNumber = this._nameToNumber[symb]
                break
            }
            else break
        }

        const additionalTime =  +date * dateNumber
        
        if(!additionalTime)
            return -1
        else if(additionalTime > this._maxTime || additionalTime < this._minTime)
            return 0
        else 
            return additionalTime
    }

    static formatMillisecondsToTime(ms: number): string {
        if(ms <= 0 || isNaN(ms)) return INFINITY_SYMB

        let timeValue = this._nameToNumber['с']
        let timeName = 'с'

        for (const [key, value] of Object.entries(this._nameToNumber)) {
            if(ms >= value) {
                timeValue = value
                timeName = key
            }
            else {
                break
            }
        }

        return `${Math.floor(ms / timeValue * 100) / 100}${timeName}`
    }

    private static _padWithLeadingZero(time: number): string {
        const MAX_NUMBER_IN_TIME = 2
        return time.toString().padStart(MAX_NUMBER_IN_TIME, '0');
    }

    static toHHMMSS(ms: number, isFloorHours = false): string {
        const seconds = Math.floor((ms / MILLISECONDS_IN_SECOND) % SECONDS_IN_MINUTE)
        const minutes = Math.floor((ms / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE)) % MINUTES_IN_HOUR)
        const hours = Math.floor((ms / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR)))

        return (
            `${
                this._padWithLeadingZero(isFloorHours ? hours % 24 : hours)
            }:${
                this._padWithLeadingZero(minutes)
            }:${this._padWithLeadingZero(
                seconds
            )}`
        )
    }

    static getUntilDate(ms: number): number {
        return (ms + Date.now()) / 1000
    }
}