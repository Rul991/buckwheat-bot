import { Context, NarrowedContext, Scenes, Telegraf, Types } from 'telegraf'
import { CallbackQuery, InlineKeyboardMarkup, InputMedia, LinkPreviewOptions, Message, MessageEntity, ParseMode, Update } from 'telegraf/types'
import CurrentMax from '../../../interfaces/other/CurrentMax'
import Duel from '../../../interfaces/schemas/duels/Duel'
import ButtonScrollerData from '../../../interfaces/callback-button-data/ButtonScrollerData'
import Skill from '../../../interfaces/duel/Skill'
import SkillAttack from '../../../enums/SkillAttack'
import Setting from '../../../interfaces/other/Setting'
import { SceneSession, WizardSessionData } from 'telegraf/scenes'
import { SessionContext } from 'telegraf/session'
import SceneAction from '../../../classes/actions/scenes/SceneAction'

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

export type SceneContextData<D extends {} = {}> = {
    scene: Scenes.SceneContextScene<
            SessionContext<SceneSession<
                D & WizardSessionData
            >
        >, D & Scenes.WizardSessionData
    > & {
        state: D
    }
}

export type TextContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
}> & Omit<Context<Update>, keyof Context<Update>> & SceneContextData

export type CallbackButtonContext = Context<Update.CallbackQueryUpdate<CallbackQuery>>
    & Omit<Context<Update>, keyof Context<Update>> & SceneContextData

export type DiceContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.DiceMessage
    update_id: number
}> & SceneContextData

export type NewMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.NewChatMembersMessage
    update_id: number
}> & SceneContextData

export type LeftMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.LeftChatMemberMessage
    update_id: number
}> & SceneContextData

export type PhotoContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.PhotoMessage
    update_id: number
}> & SceneContextData

export type PreCheckoutQueryContext = NarrowedContext<Context<Update>, Update.PreCheckoutQueryUpdate> & SceneContextData
export type SuccessfulPaymentContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.SuccessfulPaymentMessage
    update_id: number
}> & SceneContextData

export type MessageContext<D extends {} = any> = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>> & SceneContextData<D>

export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type ModeTypes = 'prod' | 'dev'

export type InventoryItemDescription = {
    name: string,
    type: InventoryItemType
}
export type InventoryItemType = 'consumable' | 'oneInfinity' | 'manyInfinity'
export type AsyncOrSync<T = void> = Promise<T> | T

export type PlayerTypes = 'knight' | 'thief' | 'sorcerer' | 'engineer' | 'bard'
export type ClassTypes = PlayerTypes | 'unknown' | 'boss' | 'bot'
export type ClassRecord = Record<ClassTypes, string>

export type ExtraEditMessageText = Types.ExtraEditMessageText
export type ExtraEditMessageMedia = Types.ExtraEditMessageMedia
export type InputMediaWrapCaption = Types.WrapCaption<InputMedia>

export type SubCommandObject = {
    name: string
}
export type SubCommandExecuteCallbackObject = {
    execute: (ctx: TextContext, other: string) => Promise<boolean>
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
    count: number
}

export type ItemExecuteCallback = (options: ItemCallbackOptions) => AsyncOrSync<boolean>

export type ShopMessageOptions = {
    index: number
    chatId: number
    userId: number
    count: number,
    updateIfInfinity?: boolean,
    hasPremium: boolean
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
        premiumDiscount?: number,
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

export type ScrollerGetObjectsOptions<D = string> = {
    data: D
    id: number
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

export type NewInvoiceParameters = Types.NewInvoiceParameters

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
    enum: any
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
        values: any[]
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
    id?: keyof D
}

export type TinyCurrentIncreaseId = {
    c: number,
    i: number,
    id?: number
}

export type MyTelegraf = Telegraf<Context & SceneContextData>

export type ExtractSceneActionData<T extends SceneAction<any>> =
    T extends SceneAction<infer D> ? D : never

export type CreateNavNumberField = {
    name: string
    value: number
}

export type CreateNavButtonsOptions = {
    current: CreateNavNumberField
    increase: CreateNavNumberField
    id?: CreateNavNumberField
    text: string
}

export type GetPageNavOptions = {
    length: number
    buttonsPerPage: number
    pageIndex: number
    current: string
    increase: string
    id?: CreateNavButtonsOptions['id']
    createNavButton?: (options: CreateNavButtonsOptions) => CallbackButtonValue
}