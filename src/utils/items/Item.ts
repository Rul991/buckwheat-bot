import { NON_DROPPABLE_ITEM_RARITY } from "../../consts/number"
import type { BotContext } from "../../types/bot"
import type { ItemCallback } from "../../types/callbacks"
import type { Gun, ContructorItemDrop, ItemMaxCount, PartialGun, Shield, ItemDrop } from "../../types/items"
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
    & Pick<
        Item<T>,
        'id' | 'key' | 'shield' | 'isConsumable' | 'basePrice' | 'emoji'
    >
    & {
        gun?: PartialGun
        callbacks?: Partial<ItemCallbacks<T>>
        maxCount?: ItemMaxCount
        drop?: ContructorItemDrop
    }

type ItemCallbackExecuteOptions = Omit<ItemCallbackOptions, 'item'>

export default class Item<T = any> {
    static readonly defaultEmoji = 'item'
    static readonly notDroppableRarity = NON_DROPPABLE_ITEM_RARITY

    static dummy(): Item {
        return new Item({
            id: -1,
            key: '',
            basePrice: 0,
            isConsumable: false,
            emoji: this.defaultEmoji,
        })
    }

    id: number
    key: string
    emoji: string

    isConsumable: boolean
    basePrice: number
    maxCount: Required<ItemMaxCount>

    shield?: Shield
    gun?: Gun
    drop: ItemDrop

    callbacks: ItemCallbacks<T>
    canUse: boolean

    constructor({
        id,
        key,
        callbacks,
        emoji,
        shield,
        gun,
        maxCount,
        isConsumable,
        basePrice,
        drop
    }: ItemConstructorOptions<T>) {
        const rarity = drop?.rarity ?? Item.notDroppableRarity

        this.id = id
        this.key = key
        this.emoji = emoji ?? Item.defaultEmoji

        this.isConsumable = isConsumable
        this.drop = drop ?
            {
                canDropFromLootBox: 'lootBoxCount' in drop,
                canDropFromWork: drop.canDropFromWork ?? false,
                rarity,
                lootBoxCount: 'lootBoxCount' in drop ?
                    typeof drop.lootBoxCount == 'number' ?
                        [drop.lootBoxCount, drop.lootBoxCount] :
                        drop.lootBoxCount ?? [0, 0]
                    : [0, 0]
            } :
            {
                canDropFromLootBox: false,
                canDropFromWork: false,
                rarity: Item.notDroppableRarity,
                lootBoxCount: [0, 0]
            }

        this.basePrice = basePrice
        this.maxCount = {
            user: maxCount?.user ?? Infinity,
            chat: maxCount?.chat ?? Infinity,
            use: maxCount?.use ?? Infinity,
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
        return ctx.t(`items/${this.key}/description`)
    }

    getTitle(ctx: BotContext): string {
        return ctx.t(`items/${this.key}/title`)
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

    get rarity(): number {
        return this.drop.rarity
    }
}