import { MILLISECONDS_IN_SECOND } from '../values/consts'
import PQueue from 'p-queue'

export default class {
    private static readonly _maxRequests: number = 30
    private static readonly _concurrency: number = this._maxRequests
    private static readonly _queue = new PQueue({
        concurrency: this._concurrency,
        interval: MILLISECONDS_IN_SECOND / this._maxRequests,
        intervalCap: this._maxRequests,
        autoStart: true
    })

    static async add(callback: () => Promise<void>) {
        await this._queue.add(
            callback
        )
    }
}