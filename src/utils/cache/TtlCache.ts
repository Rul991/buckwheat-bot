type Entry<V> = {
    value: V
    expiresAt: number
}

type TtlCacheOptions = {
    ttl: number
    maxSize?: number
    now?: () => number
}

export default class TtlCache<K, V> {
    private _entries: Map<K, Entry<V>> = new Map()
    private _ttl: number
    private _maxSize: number
    private _now: () => number

    constructor({
        ttl,
        maxSize = Infinity,
        now = Date.now
    }: TtlCacheOptions) {
        this._ttl = ttl
        this._maxSize = maxSize
        this._now = now
    }

    private _isExpired(entry: Entry<V>): boolean {
        return entry.expiresAt <= this._now()
    }

    private _evictExpired(): void {
        for (const [key, entry] of this._entries) {
            if (this._isExpired(entry)) {
                this._entries.delete(key)
            }
        }
    }

    private _evictOldest(): void {
        const oldestKey = this._entries.keys().next().value
        if (oldestKey !== undefined) {
            this._entries.delete(oldestKey)
        }
    }

    private _ensureCapacity(): void {
        if (this._entries.size < this._maxSize) return

        this._evictExpired()
        if (this._entries.size >= this._maxSize) {
            this._evictOldest()
        }
    }

    has(key: K): boolean {
        const entry = this._entries.get(key)
        if (!entry) return false
        if (this._isExpired(entry)) {
            this._entries.delete(key)
            return false
        }
        return true
    }

    get(key: K): V | undefined {
        const entry = this._entries.get(key)
        if (!entry) return undefined

        if (this._isExpired(entry)) {
            this._entries.delete(key)
            return undefined
        }

        this._entries.delete(key)
        this._entries.set(key, entry)

        return entry.value
    }

    set(key: K, value: V): void {
        this._ensureCapacity()
        this._entries.set(key, {
            value,
            expiresAt: this._now() + this._ttl
        })
    }

    async getOrSet(key: K, factory: () => Promise<V> | V): Promise<V> {
        const cached = this.get(key)
        if (cached !== undefined) return cached

        const value = await factory()
        this.set(key, value)
        return value
    }

    delete(key: K): boolean {
        return this._entries.delete(key)
    }

    clear(): void {
        this._entries.clear()
    }
}