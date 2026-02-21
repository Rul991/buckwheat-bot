import { Context, Telegraf, Types } from 'telegraf'
import { InputMedia } from 'telegraf/types'
import CurrentMax from '../../../interfaces/other/CurrentMax'
import Duel from '../../../interfaces/schemas/duels/Duel'
import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import Setting from '../../../interfaces/other/Setting'
import SceneAction from '../../../classes/actions/scenes/SceneAction'
import { CallbackButtonContext, ContextData, MyChatMemberContext, TextContext } from './contexts'
import { BuckwheatCommandOptions } from './action-options'
import CallbackButtonAction from '../../../classes/callback-button/CallbackButtonAction'
import Character from '../../../interfaces/duel/Character'
import { Gun } from './guns'

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
    minimumRank: number
    type: string
    typeName: string
}

export type IdContextData = {
    ids: {
        chatId: number
        id: number
        replyId?: number
    }
}

export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type ModeTypes = 'prod' | 'dev'

export type InventoryItemDescription = {
    name: string,
    type: InventoryItemType
    description: string
    material?: {
        rarity: number
    }
    maxCount?: {
        user?: number
        chat?: number
    }
    gun?: Gun
}
export type InventoryItemDescriptionWithId = InventoryItemDescription & {
    id: string
}
export type ShowableItem = InventoryItemDescription & {
    itemId: string
    countText: string
    count: number
}

export type InventoryItemType = 'consumable' | 'manyInfinity'
export type InventoryItemCountType = 'user' | 'chat'
export type AsyncOrSync<T = void> = Promise<T> | T

export type PlayerTypes = 'knight' | 'thief' | 'sorcerer' | 'engineer' | 'bard'
export type ClassTypes = PlayerTypes | 'unknown' | 'boss' | 'bot'
export type ClassRecord = Record<ClassTypes, string>

export type ExtraEditMessageText = Types.ExtraEditMessageText
export type ExtraEditMessageMedia = Types.ExtraEditMessageMedia
export type InputMediaWrapCaption = Types.WrapCaption<InputMedia>

export type SubCommandObject = {
    name: string
    needData?: boolean
    settingId: string
    minimumRank?: number
}
export type SubCommandExecuteCallbackObject = {
    execute: (options: BuckwheatCommandOptions & { data: string }) => Promise<boolean>
}

export type FullSubCommandObject = SubCommandObject & SubCommandExecuteCallbackObject

export type TopLevelObject = { id: number, level: number }
export type ExperienceWithId = {
    id: number
    experience: number
}

export type AnyRecord = Record<string, any>
export type ObjectOrArray<T> = T | T[]
export type CallbackButtonData = string
export type CallbackButtonValue = { text: string, data: string, notEach?: boolean }
export type CallbackButtonGlobals = Record<string, ToStringObject>
export type CallbackButtonMapValues = {
    globals?: CallbackButtonGlobals,
    values: Record<string, CallbackButtonValue[]>
    maxWidth?: number
}
export type ToStringObject = { toString: () => string }
export type Link = { name: string, link: string }

export type ItemCallbackOptions = {
    ctx: CallbackButtonContext,
    user: { link: string, name: string },
    item: ShopItem,
    count: number,
    id: number,
    chatId: number
}

export type ItemExecuteCallback = (options: ItemCallbackOptions) => AsyncOrSync<boolean | string>

export type ShopMessageOptions = {
    index: number
    chatId: number
    userId: number
    count: number
    page: number
    updateIfInfinity?: boolean
}

export type TotalCountMode = 'user' | 'chat'
export type JsonShopItem = {
    id?: string
    name?: string
    description?: string
    emoji: string
    price: number
    premiumDiscount?: number
    isPremium?: boolean
    itemName?: string
}

export type ShopItemDescription = {
    filename: string
    execute: ItemExecuteCallback
    item?: ShopItem
}

export type ShopItem = Required<JsonShopItem> & {
    execute: ShopItemDescription['execute']
}
export type ShopItemWithLength = ShopItem & { length: number, index: number }

export type ScrollerGetObjectsOptions<D = string> = {
    data: D
    id: number
    chatId: number
}

export type ScrollerSendMessageOptions<T, D = string> = {
    currentPage: number
    length: number
    objects: T[]
} & ScrollerGetObjectsOptions<D>

export type ScrollerEditMessage = {
    text: string,
    media?: InputMediaWrapCaption
    options?: ExtraEditMessageText
}
export type ScrollerEditMessageResult = ScrollerEditMessage | string | null

export type Ids = {
    chatId: number
    id: number
}

export type FileOptions = Types.ExtraDocument
export type TextAsFileOptions = {
    filename?: string
    text: string
}

export type NewInvoiceParameters = Omit<Types.NewInvoiceParameters, 'currency' | 'provider_token'>
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

export type ConstSymbol<
    F extends string,
    H extends string,
    E extends string
> = {
    full: F
    half: H
    empty: E
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
} | string

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
export type SettingType = 'string' | 'any' | 'enum' | 'boolean' | 'number'

export type SettingTypeDefault = {
    string: string
    any: any
    enum: BooleanNumberString
    boolean: boolean
    number: number
}

export type SettingPropertiesValues = {
    string: {
        min?: number
        max?: number
    }

    any: {

    }

    enum: {
        values: BooleanNumberString[]
    }

    boolean: SettingPropertiesValues['any']
    number: SettingPropertiesValues['string']
}

export type SettingWithId<T extends SettingType = any> = Setting<T> & {
    id: string
}

export type CurrentIncreaseIdNames<D extends Record<string, any>> = {
    current: keyof D
    increase: keyof D
    data?: keyof D
    id?: keyof D
}

export type TinyCurrentIncreaseId = {
    c: number,
    i: number,
    id?: number
}

export type MyTelegraf = Telegraf<Context & ContextData>

export type ExtractSceneActionData<T extends SceneAction<any>> =
    T extends SceneAction<infer D> ? D : never

export type CreateNavNumberField = CreateNavObjectField<number>

export type CreateNavObjectField<D> = {
    name: string,
    value: D
}

export type CreateNavButtonsOptions<D = undefined> = {
    current: CreateNavNumberField
    increase: CreateNavNumberField
    id?: CreateNavNumberField
    data?: CreateNavObjectField<D>
    text: string
}

export type GetPageNavOptions<D> = {
    length: number
    buttonsPerPage: number
    pageIndex: number
    current: string
    increase: string
    id?: CreateNavButtonsOptions['id']
    data?: CreateNavButtonsOptions<D>['data']
    createNavButton?: (options: CreateNavButtonsOptions<D>) => CallbackButtonValue
}

export type MafiaTypes = 'mafia' | 'medic' | 'sheriff' | 'harlot' | 'civilian'

export type KeyboardDatabaseData = {
    id: number,
    msgId: number,
    pos: [number, number]
}

export type CommandVisibleTypes = {
    type: string
    title: string
}

export type GetSettingForManyResult<K extends SettingType> = {
    value: SettingTypeDefault[K]
    id: number
}

export type BooleanNumberString = boolean | number | string
export type ChatMemberStatus = MyChatMemberContext['myChatMember']['old_chat_member']['status']
export type DataFromCallbackButton<A> =
    A extends CallbackButtonAction<infer U> ? U : never

export type CharactersMap = Map<DuelFilename, Character>
export type FromArray<T extends Array<any>> = T extends Array<infer U> ? U : never
export type RoleplayCase = 'genitive' | 'dative' | 'creative'