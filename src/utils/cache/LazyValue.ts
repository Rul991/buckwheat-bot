type Callback<T> = () => Promise<T> | T
const UNSET = Symbol('UNSET')

export default class LazyValue<T> {
    private _updateCallback: Callback<T>
    private _cachedValue: T | typeof UNSET = UNSET
    private _inFlight?: Promise<T>
    private _errorKey?: string

    constructor(callback: Callback<T>, errorKey?: string) {
        this._updateCallback = callback
        this._errorKey = errorKey
    }

    update(): void {
        this._cachedValue = UNSET
        this._inFlight = undefined
    }

    async get(): Promise<T> {
        if (this._cachedValue !== UNSET) return this._cachedValue
        if (this._inFlight) return this._inFlight

        this._inFlight = (async () => {
            try {
                const value = await this._updateCallback()
                this._cachedValue = value
                return value
            } finally {
                this._inFlight = undefined
            }
        })()

        return this._inFlight
    }

    set(value: T): void {
        this._cachedValue = value
        this._inFlight = undefined
    }

    async require(): Promise<NonNullable<T>> {
        const value = await this.get()
        if (value === undefined || value === null) {
            throw new Error(`Cache ${this._errorKey || '???'} is undefined or null`)
        }
        return value as NonNullable<T>
    }
}