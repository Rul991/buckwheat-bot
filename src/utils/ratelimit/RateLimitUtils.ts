import Logging from '../Logging'
import TimeUtils from '../TimeUtils'
import { MILLISECONDS_IN_SECOND, MODE, SECONDS_IN_MINUTE } from '../values/consts'

type Restrictions = {
    time: number
    requests: number
    type: string
}

export default class {
    private static readonly _userMaxRestrictions: Restrictions = {
        time: MILLISECONDS_IN_SECOND,
        requests: 1,
        type: 'user'
    }

    private static readonly _chatMaxRestrictions: Restrictions = {
        time: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE,
        requests: 20,
        type: 'chat'
    }

    private static readonly _map = new Map<
        string,
        { lastTime: number, requests: number }
    >()

    private static _isLimit(
        id: string,
        {
            time,
            requests: maxRequests,
            type
        }: Restrictions
    ) {
        let current = this._map.get(id)
        if (!current) {
            current = {
                lastTime: Date.now(),
                requests: 0
            }
        }

        let {
            lastTime,
            requests: currentRequests
        } = current

        const isTimeExpired = TimeUtils.isTimeExpired(lastTime, time)
        if (isTimeExpired) {
            currentRequests = 0
            lastTime = Date.now()
        }

        currentRequests++

        this._map.set(
            id,
            {
                lastTime,
                requests: currentRequests
            }
        )
        Logging.log({
            ratelimit: {
                current,
                type
            }
        })
        return currentRequests > maxRequests
    }

    static isLimit(chatId: number, id: number): boolean {
        // if (MODE == 'dev') return false

        if(this._isLimit(`${chatId}:${id}`, this._userMaxRestrictions)) return true
        if(this._isLimit(`${chatId}`, this._chatMaxRestrictions)) return true

        return false
    }
}