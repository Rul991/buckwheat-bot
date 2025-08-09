import { HOURS_IN_DAY, MILLISECONDS_IN_SECOND, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from './consts'

export default class TimeUtils {
    private static _nameToNumber = {
        'с': MILLISECONDS_IN_SECOND,
        'м': SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
        'ч': MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
        'д': HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
    }

    private static _minTime = 30_000
    private static _maxTime = 366 * this._nameToNumber['д']

    static getTime(time: string): number {
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

    static getTimeName(time: number): string {
        if(time <= 0 || isNaN(time)) return '∞'

        let timeValue = this._nameToNumber['с']
        let timeName = 'с'

        for (const [key, value] of Object.entries(this._nameToNumber)) {
            if(time >= value) {
                timeValue = value
                timeName = key
            }
            else {
                break
            }
        }

        return `${Math.floor(time / timeValue * 100) / 100}${timeName}`
    }

    static getUntilDate(ms: number): number {
        return (ms + Date.now()) / 1000
    }
}