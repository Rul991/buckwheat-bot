type Callback<T> = () => Promise<T> | T

export default class LazyValue<T> {
    private _updateCallback: Callback<T>
    private _cachedValue?: T
    private _needUpdate: boolean
    private _errorKey?: string

    constructor(callback: Callback<T>, errorKey?: string) {
        this._updateCallback = callback
        this._needUpdate = true
        this._errorKey = errorKey
    }

    update(): void {
        this._needUpdate = true
    }

    async get(): Promise<T> {
        if(this._needUpdate) {
            this._needUpdate = false
            this._cachedValue = await this._updateCallback()
        }

        return this._cachedValue!
    }

    set(value: T): void {
        this._cachedValue = value
    }

    async require(): Promise<NonNullable<T>> {
        const value = await this.get()

        if(value === undefined || value === null) {
            throw new Error(`Cache ${this._errorKey} is undefined or null`)
        }

        return value
    }
}