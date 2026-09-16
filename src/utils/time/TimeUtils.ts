import { MILLISECONDS_IN_DAY, MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_MONTH, MILLISECONDS_IN_SECOND, MILLISECONDS_IN_YEAR, MINUTES_IN_HOUR, SECONDS_IN_MINUTE } from "../../consts/time"
import type { BotContext } from "../../types/bot"
import Logger from "../logs/Logger"
import MathUtils from "../math/MathUtils"
import StringUtils from "../string/StringUtils"

type TimeValues = {
    letters: string[]
    milliseconds: number
    type: string
}

export default class TimeUtils {
    private static readonly _parseTimeRegex: RegExp = /(\d+(?:[.,]\d+)?)(\p{L}+)/gu
    private static _timeValues: TimeValues[] = [
        {
            letters: ['с', 's'],
            milliseconds: MILLISECONDS_IN_SECOND,
            type: 'second'
        },
        {
            letters: ['м', 'm'],
            milliseconds: MILLISECONDS_IN_MINUTE,
            type: 'minute'
        },
        {
            letters: ['ч', 'h'],
            milliseconds: MILLISECONDS_IN_HOUR,
            type: 'hour'
        },
        {
            letters: ['д', 'd'],
            milliseconds: MILLISECONDS_IN_DAY,
            type: 'day'
        },
        {
            letters: ['М', 'M'],
            milliseconds: MILLISECONDS_IN_MONTH,
            type: 'month'
        },
        {
            letters: ['г', 'y'],
            milliseconds: MILLISECONDS_IN_YEAR,
            type: 'year'
        }
    ]

    static minTime = 30 * MILLISECONDS_IN_SECOND
    static maxTime = MILLISECONDS_IN_YEAR
    static defaultTime = 0

    private static _letterToMilliseconds(letter: string): number {
        for (const { letters, milliseconds } of this._timeValues) {
            if (letters.includes(letter)) {
                return milliseconds
            }
        }

        return this.defaultTime
    }

    static clamp(time: number): number {
        const isClamp = MathUtils.isClamp(time, this.minTime, this.maxTime)
        return isClamp ? time : this.defaultTime
    }

    static parseTimeToMilliseconds(time: string): number {
        const matches = Array.from(time.matchAll(this._parseTimeRegex))
        Logger.debug('TimeUtils.parseTimeToMilliseconds', matches)
        if (!matches.length) return this.defaultTime

        let result = 0
        for (const match of matches) {
            const [_, rawNumber, letter] = match as unknown as [string, string, string]
            const milliseconds = this._letterToMilliseconds(letter)
            const number = StringUtils.getNumberFromString(rawNumber)
            result += number * milliseconds
        }

        return result
    }

    static formatMillisecondsToTime(ctx: BotContext, ms: number, isClamp = false): string {
        if (ms <= this.defaultTime) {
            return ctx.t('time/infinity')
        }

        if (ms < MILLISECONDS_IN_DAY) {
            return this.toHHMMSS(ctx, ms)
        }

        let type = ''
        let value = 0

        for (const timeValue of this._timeValues) {
            if (ms >= timeValue.milliseconds) {
                type = timeValue.type
                value = MathUtils.floor(ms / timeValue.milliseconds, 2)
            }
        }

        return ctx.t(
            'time/date',
            {
                raw: ms,
                value,
                type,
                max: {
                    need: isClamp,
                    value: this.maxTime
                }
            }
        )
    }

    static toHHMMSS(ctx: BotContext, ms: number): string {
        const seconds = Math.ceil((ms / MILLISECONDS_IN_SECOND) % SECONDS_IN_MINUTE)
        const minutes = Math.floor((ms / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE)) % MINUTES_IN_HOUR)
        const hours = Math.floor((ms / (MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR)))

        return ctx.t(
            'time/time',
            {
                hours,
                minutes,
                seconds
            }
        )
    }

    static getElapsed(ms: number): number {
        return Date.now() - ms
    }

    static isExpired(time: number, needTime: number): boolean {
        return TimeUtils.getElapsed(time) >= needTime
    }

    static getUntilDate(ms: number): number {
        return MathUtils.floor((Date.now() + ms))
    }

    static getUntilDateInSeconds(ms: number): number {
        return this.getUntilDate(ms) / MILLISECONDS_IN_SECOND
    }
}