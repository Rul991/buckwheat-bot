import TimeUtils from '../TimeUtils'
import { MILLISECONDS_IN_SECOND } from '../values/consts'

export default class {
    private static readonly _maxRequests = 1
    private static readonly _intervalTime = MILLISECONDS_IN_SECOND * this._maxRequests
    private static readonly _map = new Map<
        number, 
        {lastTime: number, requests: number}
    >()

    static isLimit(id: number): boolean {
        let current = this._map.get(id)
        if(!current) {
            current = {
                lastTime: Date.now(),
                requests: 0
            }
        }

        let {
            lastTime,
            requests
        } = current
        
        const isTimeExpired = TimeUtils.isTimeExpired(lastTime, this._intervalTime)
        if(isTimeExpired) {
            requests = 0
            lastTime = Date.now()
        }

        requests++

        this._map.set(
            id,
            {
                lastTime,
                requests
            }
        )
        return requests > this._maxRequests
    }
}