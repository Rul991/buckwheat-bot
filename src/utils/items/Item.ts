import type { BotContext } from "../../types/bot"
import type { ItemCallback } from "../../types/callbacks"
import type { Gun, ItemMaxCount, PartialGun, Shield } from "../../types/items"
import type { ItemCallbackOptions } from "../../types/items"

type ItemCallbacks<T> = {
    use: ItemCallback<T>
    canBuy: ItemCallback<boolean>
}

type ItemVars = {
    title: string
    description: string
    emoji: string
}

type ItemConstructorOptions<T> =
    & Pick<Item<T>, 'id' | 'key' | 'shield' | 'isConsumable' | 'basePrice'>
    & Partial<Pick<Item<T>, 'emoji' | 'rarity'>>
    & {
        gun?: PartialGun
        callbacks?: Partial<ItemCallbacks<T>>
        maxCount?: ItemMaxCount
    }

type ItemCallbackExecuteOptions = Omit<ItemCallbackOptions, 'item'>

export default class Item<T = any> {
    static readonly defaultEmoji = 'item'
    static readonly notDroppableRarity = -1

    static dummy(): Item {
        return new Item({
            id: -1,
            key: '',
            basePrice: 0,
            isConsumable: false,
        })
    }

    id: number
    key: string
    emoji: string

    isConsumable: boolean
    rarity: number

    basePrice: number
    maxCount: Required<ItemMaxCount>

    shield?: Shield
    gun?: Gun

    callbacks: ItemCallbacks<T>
    canUse: boolean

    constructor({
        id,
        key,
        callbacks,
        emoji,
        rarity,
        shield,
        gun,
        maxCount,
        isConsumable,
        basePrice,
    }: ItemConstructorOptions<T>) {
        this.id = id
        this.key = key
        this.emoji = emoji ?? Item.defaultEmoji

        this.isConsumable = isConsumable
        this.rarity = rarity ?? Item.notDroppableRarity

        this.basePrice = basePrice
        this.maxCount = {
            user: maxCount?.user ?? Infinity,
            chat: maxCount?.chat ?? Infinity
        }

        this.gun = gun as Gun
        this.shield = shield

        this.callbacks = {
            use: callbacks?.use ?? (() => undefined as T),
            canBuy: callbacks?.canBuy ?? (() => true)
        }
        this.canUse = Boolean(callbacks?.use)

        if (this.gun && !this.gun.ammo) {
            this.gun.ammo = this
        }
    }

    getDescription(ctx: BotContext): string {
        return ctx.t(`items/description/${this.key}`)
    }

    getTitle(ctx: BotContext): string {
        return ctx.t(`items/title/${this.key}`)
    }

    getEmoji(ctx: BotContext): string {
        return ctx.t(
            'items/system/emoji',
            {
                key: this.emoji
            }
        )
    }

    getVars(ctx: BotContext): ItemVars {
        return {
            title: this.getTitle(ctx),
            description: this.getDescription(ctx),
            emoji: this.getEmoji(ctx)
        }
    }

    private async _executeItemCallback<T>(
        options: ItemCallbackExecuteOptions,
        callback: ItemCallback<T>,
    ): Promise<T> {
        return await callback({
            ...options,
            item: this
        })
    }

    async canBuy(options: ItemCallbackExecuteOptions): Promise<boolean> {
        return await this._executeItemCallback(
            options,
            this.callbacks.canBuy,
        )
    }

    async use(options: ItemCallbackExecuteOptions): Promise<T> {
        return (await this._executeItemCallback(
            options,
            this.callbacks.use,
        ))!
    }
}