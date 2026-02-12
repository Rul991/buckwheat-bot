import { any, boolean, int, literal, number, object, record, string, tuple, ZodLiteral, ZodType } from 'zod'
import Character from '../../interfaces/duel/Character'
import Characteristics from '../../interfaces/duel/Characteristics'
import SimpleCommand from '../../interfaces/other/SimpleComand'
import { NewInvoiceParameters, JsonShopItem, InventoryItemDescription, TinyCurrentIncreaseId, ClassTypes, KeyboardDatabaseData, SettingPropertiesValues, BooleanNumberString } from './types/types'
import StartUp from '../../interfaces/other/StartUp'
import CubeData from '../../interfaces/callback-button-data/CubeData'
import ScrollerWithIdData from '../../interfaces/callback-button-data/ScrollerWithIdData'
import ScrollerData from '../../interfaces/callback-button-data/ScrollerData'
import UserReplyIdsData from '../../interfaces/callback-button-data/UserReplyIdsData'
import SkillExecute from '../../interfaces/other/SkillExecute'
import Setting from '../../interfaces/other/Setting'
import ClassUtils from '../ClassUtils'
import RankUtils from '../RankUtils'
import MarketData from '../../interfaces/callback-button-data/MarketData'
import JsonSkill from '../../interfaces/duel/JsonSkill'
import LevelUtils from '../level/LevelUtils'
import { Recipe } from './types/recipes'
import CraftData from '../../interfaces/callback-button-data/CraftData'

export const simpleCommandSchema: ZodType<SimpleCommand> = object({
    name: string(),
    src: string().or(string().array()).optional(),
    text: string().or(string().array()).optional(),
    avoidOther: boolean().optional(),
    aliases: string().array().optional()
})

export const settingPartSchema: ZodType<Omit<Setting<any>, 'type' | 'default' | 'properties'>> = object({
    title: string(),
    description: string(),
})

export const minMaxOptionalProperties: ZodType<SettingPropertiesValues['number' | 'string']> = object({
    min: number().optional(),
    max: number().optional()
})

export const booleanNumberStringSchema: ZodType<BooleanNumberString> = string()
    .or(number())
    .or(boolean())

export const stringSetting: ZodType<Setting<'string'>> = settingPartSchema
    .and(
        object({
            type: literal('string'),
            default: string(),
            properties: minMaxOptionalProperties
        })
    )

export const numberSettingSchema: ZodType<Setting<'number'>> = settingPartSchema
    .and(
        object({
            type: literal('number'),
            default: number(),
            properties: minMaxOptionalProperties
        })
    )

export const enumSettingSchema: ZodType<Setting<'enum'>> = settingPartSchema
    .and(
        object({
            type: literal('enum'),
            default: booleanNumberStringSchema,
            properties: object({
                values: booleanNumberStringSchema.array()
            })
        })
            .refine(
                ({ default: defaultValue, properties: { values } }) => {
                    return values.length == 0 || values.includes(defaultValue)
                },
                {
                    path: ['default'],
                    error: 'default can be only like in values'
                }
            )
    )

export const booleanSettingSchema: ZodType<Setting<'boolean'>> = settingPartSchema
    .and(
        object({
            type: literal('boolean'),
            default: boolean(),
            properties: object()
        })
    )

export const anySettingSchema: ZodType<Setting<'any'>> = settingPartSchema
    .and(
        object({
            type: literal('any'),
            default: any(),
            properties: object()
        })
    )

export const settingSchema: ZodType<Setting<any>> = stringSetting
    .or(numberSettingSchema)
    .or(enumSettingSchema)
    .or(booleanSettingSchema)
    .or(anySettingSchema)

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

export const startUpNumberSchema: ZodType<StartUp<number>> = object({
    start: number(),
    up: number()
})

export const skillExecuteSchema: ZodType<SkillExecute> = object({
    name: string(),
    args: any().array()
})

export const skillExecuteArraySchema: ZodType<SkillExecute[]> = skillExecuteSchema.array()
export const classTypesSchema: ZodLiteral<ClassTypes> = literal(ClassUtils.classNames)

export const jsonSkillSchema: ZodType<JsonSkill> = object({
    level: int().min(LevelUtils.min),
    info: object({
        title: string(),
        description: string(),
    }),
    execute: object({
        user: skillExecuteArraySchema,
        enemy: skillExecuteArraySchema,
    }),
    effect: object({
        className: classTypesSchema
    }).optional()
})

export const characterSchema: ZodType<Character> = object({
    characteristics: object({
        hp: startUpNumberSchema,
        mana: startUpNumberSchema
    }),
    skill: object({
        showable: string().array(),
        main: string(),
        effects: string().array(),
    }),
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
    type: literal(['consumable', 'oneInfinity', 'manyInfinity']),
    description: string(),
    material: object({
        rarity: number(),
        maxCount: number().optional()
    }).optional()
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

export const keyboardDbDataSchema: ZodType<KeyboardDatabaseData> = object({
    id: number(),
    msgId: number(),
    pos: tuple([number(), number()])
})

export const ranksSchema = record(
    string(),
    number()
        .min(RankUtils.min)
        .max(RankUtils.max)
)

export const marketDataSchema: ZodType<MarketData> = tinyCurrentIncreaseIdSchema
    .and(object({
        id: number(),
        itemId: string().optional()
    }))

export const recipeSchema: ZodType<Recipe> = object({
    level: number(),
    result: object({
        name: string(),
        count: number().optional()
    }),
    materials: record(
        string(),
        number()
    )
})

export const craftSchema: ZodType<CraftData> = object({
    id: number(),
    index: number(),
    page: number(),
    count: number().optional()
})