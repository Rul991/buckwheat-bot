import { Context, NarrowedContext } from 'telegraf'
import { CallbackQuery, InlineKeyboardMarkup, LinkPreviewOptions, Message, MessageEntity, ParseMode, Update } from 'telegraf/types'
import CurrentMax from '../../interfaces/other/CurrentMax'
import Duel from '../../interfaces/schemas/duels/Duel'
import ButtonScrollerData from '../../interfaces/callback-button-data/ButtonScrollerData'
import Skill from '../../interfaces/duel/Skill'
import SkillAttack from '../../enums/SkillAttack'

export type MaybeString = string | undefined
export type CommandStrings = [string, MaybeString, MaybeString]
export type CommandDescription = {
    needData: boolean,
    argumentText?: string,
    replySupport: boolean,
    isShow: boolean,
    description: string,
    name: string
    aliases: string[]
    isPremium: boolean,
}

export type TextContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
}> & Omit<Context<Update>, keyof Context<Update>>

export type CallbackButtonContext = Context<Update.CallbackQueryUpdate<CallbackQuery>>
    & Omit<Context<Update>, keyof Context<Update>>

export type DiceContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.DiceMessage
    update_id: number
}>

export type NewMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.NewChatMembersMessage
    update_id: number
}>

export type LeftMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.LeftChatMemberMessage
    update_id: number
}>

export type PhotoContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.PhotoMessage
    update_id: number
}>

export type PreCheckoutQueryContext = NarrowedContext<Context<Update>, Update.PreCheckoutQueryUpdate>
export type SuccessfulPaymentContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.SuccessfulPaymentMessage
    update_id: number
}>

export type MessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>

export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type ModeTypes = 'prod' | 'dev'

export type InventoryItemDescription = {
    name: string,
    type: InventoryItemType
}
export type InventoryItemType = 'consumable' | 'oneInfinity' | 'manyInfinity'

export type Constructor<T> = any
export type AsyncOrSync<T = void> = Promise<T> | T

export type PlayerTypes = 'knight' | 'thief' | 'sorcerer' | 'engineer' | 'bard'
export type ClassTypes = PlayerTypes | 'unknown' | 'boss' | 'bot'
export type ClassRecord = Record<ClassTypes, string>

export type ExtraEditMessageText = {
    reply_markup?: InlineKeyboardMarkup
    entities?: MessageEntity[],
    link_preview_options?: LinkPreviewOptions,
    parse_mode?: ParseMode
}

export type NameObject = { name: string }
export type TopLevelObject = { id: number, level: number }

export type AnyRecord = Record<string, any>
export type ObjectOrArray<T> = T | T[]
export type CallbackButtonData = string
export type CallbackButtonValue = { text: string, data: string, notEach?: boolean }
export type CallbackButtonGlobals = Record<string, ToStringObject>
export type CallbackButtonMapValues = {
    globals?: CallbackButtonGlobals,
    values: Record<string, CallbackButtonValue[]>
}
export type ToStringObject = { toString: () => string }
export type Link = { name: string, link: string }

export type ItemCallbackOptions = {
    ctx: CallbackButtonContext,
    user: { link: string, name: string },
    item: ShopItem,
    count: number
}

export type ItemExecuteCallback = (options: ItemCallbackOptions) => AsyncOrSync<boolean>

export type ShopMessageOptions = {
    index: number
    chatId: number
    userId: number
    count: number,
    updateIfInfinity?: boolean
}

export type TotalCountMode = 'user' | 'chat' 
export type JsonShopItem =
    {
        id?: string
        name: string,
        description: string,
        emoji: string,
        price: number,
        maxCount?: number,
        isPremium?: boolean,
        totalCount?: number,
        totalCountMode?: TotalCountMode,
        execute?: ShopItemDescription['execute']
    }

export type ShopItemDescription = {
    filename: string
    execute: ItemExecuteCallback
    item?: ShopItem
}

export type ShopItem = Required<JsonShopItem>
export type ShopItemWithLength = ShopItem & { length: number, index: number }

export type ScrollerSendMessageOptions<T> = {
    currentPage: number
    length: number
    objects: T[]
    data: string
    id: number
}

export type ScrollerEditMessage = {
    text: string,
    options?: ExtraEditMessageText
}
export type ScrollerEditMessageResult = ScrollerEditMessage | string | null

export type Ids = {
    chatId: number
    id: number
}

export type NewInvoiceParameters = {
    title: string
    description: string
    payload: string
    prices: readonly {
        label: string
        amount: number
    }[]
    max_tip_amount?: number | undefined
    suggested_tip_amounts?: number[] | undefined
    start_parameter?: string | undefined
    provider_data?: string | undefined
    photo_url?: string | undefined
    photo_size?: number | undefined
    photo_width?: number | undefined
    photo_height?: number | undefined
    need_name?: boolean | undefined
    need_phone_number?: boolean | undefined
    need_email?: boolean | undefined
    need_shipping_address?: boolean | undefined
    send_phone_number_to_provider?: boolean | undefined
    send_email_to_provider?: boolean | undefined
    is_flexible?: boolean | undefined
    protect_content?: boolean | undefined
}

export type Progress = {
    symbols: {
        full: string,
        half: string,
        empty: string
        maxCount: number
    }
    progress: CurrentMax
}
export type DuelFilename = ClassTypes
export type JavascriptTypes = 'string' | 'number' | 'boolean'

export type DuelEndOptions = {
    chatId: number,
    duelId: number
    winnerId: number
}

export type FirstSecond = {
    first: number
    second: number
}

export type DuelResult = {
    winner: number
    loser: number
    duel: Duel
    prize: number
    experience: FirstSecond
}

export type TypeKeys<T, N> = {
    [K in keyof T]: T[K] extends N ? K : never
}[keyof T]

export type DuelCanUseOptions = {
    duel: number
    user: number
}

export type ButtonScrollerArgs<D extends ButtonScrollerData = ButtonScrollerData> = {
    ctx: CallbackButtonContext
    data: D
}

export type MethodExecuteArguments<A extends any[]> = {
    args: A,
    id: number
    chatId: number
    ctx: CallbackButtonContext
    skill: Skill
    attack: SkillAttack
    userId: number
    enemyId: number
    isSecret?: boolean
}

export type ConstSymbol<
    F extends string,
    H extends string,
    E extends string
> = {
    FULL: F
    HALF: H
    EMPTY: E
}

export type UseSkillOptions = {
    skill: Skill
    ctx: CallbackButtonContext
    userId: number
    enemyId: number
    attack: SkillAttack
}

export type SkillMethodGetText = { 
    isExecute: boolean, 
    isSecret?: boolean
}

export type NoOtherChangeProfileMessage = {
    ctx: TextContext,
    chatId: number,
    id: number
}

export type HasOtherChangeProfileMessage = NoOtherChangeProfileMessage & {
    other: string
}

export type ButtonScrollerOptions<D> = {
    ctx: CallbackButtonContext
    data: D
    chatId: number
    id: number
}

export type ButtonScrollerEditMessageResult = {
    text?: string
    values: CallbackButtonMapValues
}

export type ButtonScrollerFullOptions<O, D> = ButtonScrollerOptions<D> & {
    objects: O[]
    slicedObjects: O[]
}

export type ButtonScrollerSlice = {
    start: number
    end: number
    new: number
}

export type DeleteEffectsByNameTargetStepsOptions = {
    duelId: number
    name: string
    steps: number
    target: number
    isEvery?: boolean
}

export type HpMana = 'hp' | 'mana'