import { any, boolean, literal, number, object, string, tuple, ZodLiteral, ZodType } from 'zod'
import Character from '../../interfaces/duel/Character'
import Characteristics from '../../interfaces/duel/Characteristics'
import SimpleCommand from '../../interfaces/other/SimpleComand'
import { NewInvoiceParameters, JsonShopItem, InventoryItemDescription, TinyCurrentIncreaseId, ClassTypes, KeyboardDatabaseData } from './types/types'
import Skill from '../../interfaces/duel/Skill'
import StartUp from '../../interfaces/other/StartUp'
import CubeData from '../../interfaces/callback-button-data/CubeData'
import ScrollerWithIdData from '../../interfaces/callback-button-data/ScrollerWithIdData'
import ScrollerData from '../../interfaces/callback-button-data/ScrollerData'
import UserReplyIdsData from '../../interfaces/callback-button-data/UserReplyIdsData'
import SkillExecute from '../../interfaces/other/SkillExecute'
import Setting from '../../interfaces/other/Setting'
import ClassUtils from '../ClassUtils'

export const simpleCommandSchema: ZodType<SimpleCommand> = object({
    name: string(),
    src: string().or(string().array()).optional(),
    text: string().or(string().array()).optional(),
    avoidOther: boolean().optional(),
    aliases: string().array().optional()
})

export const settingSchema: ZodType<Setting<any>> = object({
    title: string(),
    description: string(),
    type: literal(['string', 'number', 'boolean', 'any', 'enum']),
    default: any(),
    properties: object()
})

export const jsonShopItemSchema: ZodType<JsonShopItem> = object({
    id: string().optional(),
    name: string(),
    description: string(),
    emoji: string(),
    price: number(),
    maxCount: number().optional(),
    premiumDiscount: number().optional(),
    isPremium: boolean().optional(),
    totalCount: number().optional(),
    totalCountMode: literal(['user', 'chat']).optional(),
    itemName: string().optional(),
    execute: any().optional(),
})

export const invoiceSchema: ZodType<NewInvoiceParameters> = object({
    title: string(),
    description: string(),
    payload: string(),
    prices: object({
        label: string(),
        amount: number()
    }).array(),
    max_tip_amount: number().optional(),
    suggested_tip_amounts: number().array().optional(),
    start_parameter: string().optional(),
    provider_data: string().optional(),
    photo_url: string().optional(),
    photo_size: number().optional(),
    photo_width: number().optional(),
    photo_height: number().optional(),
    need_name: boolean().optional(),
    need_email: boolean().optional(),
    need_phone_number: boolean().optional(),
    need_shipping_address: boolean().optional(),
    send_phone_number_to_provider: boolean().optional(),
    send_email_to_provider: boolean().optional(),
    is_flexible: boolean().optional(),
})

export const characteristicsSchema: ZodType<Characteristics> = object({
    hp: number(),
    mana: number()
})

export const startUpSchema: ZodType<StartUp> = object({
    start: object(),
    up: object()
})

export const skillExecuteSchema: ZodType<SkillExecute> = object({
    name: string(),
    args: any().array()
})

export const skillExecuteArraySchema: ZodType<SkillExecute[]> = skillExecuteSchema.array()

export const skillSchema: ZodType<Skill> = object({
    id: string(),
    isAlwaysUsable: boolean().optional(),
    secret: boolean().optional(),
    level: number(),
    title: string(),
    description: string(),
    onEnemy: boolean(),
    cost: skillExecuteArraySchema,
    execute: skillExecuteArraySchema,
    isEffect: boolean().optional(),
})


export const characterSchema: ZodType<Character> = object({
    characteristics: object({
        start: characteristicsSchema,
        up: characteristicsSchema,
    }),
    skills: skillSchema.array()
})

export const cubeDataSchema: ZodType<CubeData> = object({
    r: number(),
    u: number(),
    m: number()
})

export const scrollerDataSchema: ZodType<ScrollerData> = object({
    current: number(),
    increase: number()
})

export const scrollerWithIdDataSchema: ZodType<ScrollerWithIdData> = object({
    id: number()
}).and(scrollerDataSchema)

export const userReplyIdsDataSchema: ZodType<UserReplyIdsData> = object({
    user: number(),
    reply: number(),
})

export const inventoryItemDescriptionSchema: ZodType<InventoryItemDescription> = object({
    name: string(),
    type: literal(['consumable', 'oneInfinity', 'manyInfinity'])
})

export const tinyCurrentIncreaseIdSchema: ZodType<TinyCurrentIncreaseId> = object({
    c: number(),
    i: number(),
    id: number().optional()
})

export const idSchema = object({
    id: number()
})

export const cardBuySchema = object({
    s: number(),
    id: number(),
    p: number()
})

export const dataSchema = idSchema
    .and(object({
        n: string()
    }))

export const duelSchema = object({
    duel: number()
})

export const classTypesSchema: ZodLiteral<ClassTypes> = literal(ClassUtils.classNames)

export const keyboardDbDataSchema: ZodType<KeyboardDatabaseData> = object({
    id: number(),
    msgId: number(),
    pos: tuple([number(), number()])
})