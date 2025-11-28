import { JSONSchemaType } from 'ajv'
import Character from '../../interfaces/duel/Character'
import Characteristics from '../../interfaces/duel/Characteristics'
import SimpleCommand from '../../interfaces/other/SimpleComand'
import { NewInvoiceParameters, JsonShopItem } from './types/types'
import Skill from '../../interfaces/duel/Skill'
import StartUp from '../../interfaces/other/StartUp'
import CubeData from '../../interfaces/callback-button-data/CubeData'
import ScrollerWithIdData from '../../interfaces/callback-button-data/ScrollerWithIdData'
import ScrollerData from '../../interfaces/callback-button-data/ScrollerData'
import UserReplyIdsData from '../../interfaces/callback-button-data/UserReplyIdsData'
import SkillExecute from '../../interfaces/other/SkillExecute'
import Setting from '../../interfaces/other/Setting'

export const simpleCommandSchema: JSONSchemaType<SimpleCommand> = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        src: {
            type: ['null', 'string', 'array'],
            anyOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
            ],
            nullable: true,
        },
        text: {
            type: ['null', 'string', 'array'],
            anyOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
            ],
            nullable: true
        },
        aliases: {
            type: 'array',
            items: {
                type: 'string'
            },
            nullable: true
        },
        avoidOther: {
            type: 'boolean',
            nullable: true
        }
    },
    required: ['name'],
}

// @ts-ignore
export const settingSchema: JSONSchemaType<Setting<any>> = {
    type: 'object',
    properties: {
        type: {
            type: 'string'
        },
        title: {
            type: 'string',
            nullable: false
        },
        description: {
            type: 'string',
        },
        default: {
            
        },
        properties: {
            type: 'object',
            nullable: true
        }
    },
    required: ['title', 'type'],
}

export const jsonShopItemSchema: JSONSchemaType<JsonShopItem> = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            nullable: true
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        emoji: {
            type: 'string',
        },
        price: {
            type: 'number',
        },
        maxCount: {
            type: 'number',
            nullable: true
        },
        isPremium: {
            type: 'boolean',
            nullable: true
        },
        totalCount: {
            type: 'number',
            nullable: true
        },
        premiumDiscount: {
            type: 'number',
            nullable: true
        },
        totalCountMode: {
            type: 'string',
            nullable: true
        },
        execute: {
            type: 'object',
            nullable: true
        }
    },
    required: [
        'name',
        'description',
        'emoji',
        'price'
    ]
}


export const invoiceSchema: JSONSchemaType<NewInvoiceParameters> = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        payload: {
            type: 'string'
        },
        prices: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    label: { type: 'string' },
                    amount: { type: 'number' }
                },
                required: ['label', 'amount'],
                
            }
        },
        max_tip_amount: {
            type: 'number',
            nullable: true
        },
        suggested_tip_amounts: {
            type: 'array',
            items: { type: 'number' },
            nullable: true
        },
        start_parameter: {
            type: 'string',
            nullable: true
        },
        provider_data: {
            type: 'string',
            nullable: true
        },
        photo_url: {
            type: 'string',
            nullable: true
        },
        photo_size: {
            type: 'number',
            nullable: true
        },
        photo_width: {
            type: 'number',
            nullable: true
        },
        photo_height: {
            type: 'number',
            nullable: true
        },
        need_name: {
            type: 'boolean',
            nullable: true
        },
        need_phone_number: {
            type: 'boolean',
            nullable: true
        },
        need_email: {
            type: 'boolean',
            nullable: true
        },
        need_shipping_address: {
            type: 'boolean',
            nullable: true
        },
        send_phone_number_to_provider: {
            type: 'boolean',
            nullable: true
        },
        send_email_to_provider: {
            type: 'boolean',
            nullable: true
        },
        is_flexible: {
            type: 'boolean',
            nullable: true
        },
        protect_content: {
            type: 'boolean',
            nullable: true
        }
    },
    required: ['title', 'description', 'payload', 'prices']
}

export const characteristicsSchema: JSONSchemaType<Characteristics> = {
    type: 'object',
    properties: {
        hp: { type: 'number' },
        mana: { type: 'number' }
    },
    required: ['hp', 'mana']
}

export const startUpSchema: JSONSchemaType<StartUp> = {
    type: 'object',
    properties: {
        start: { type: 'object', additionalProperties: true },
        up: { type: 'object', additionalProperties: true }
    },
    required: ['start', 'up']
}

export const anySchema: JSONSchemaType<any> = {
    type: ['string', 'boolean', 'number']
}

export const skillExecuteSchema: JSONSchemaType<SkillExecute> = {
    type: 'object',
    properties: {
        name: { 
            type: 'string' 
        },
        args: {
            type: 'array',
            items: anySchema
        }
    },
    required: ['args', 'name'],
    additionalProperties: true
}

export const skillExecuteArraySchema: JSONSchemaType<SkillExecute[]> = {
    type: 'array',
    items: skillExecuteSchema
}

export const skillSchema: JSONSchemaType<Skill> = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        level: { type: 'integer', minimum: 1, },
        title: { type: 'string' },
        description: { type: 'string' },
        onEnemy: { type: 'boolean' },
        isAlwaysUsable: { type: 'boolean', nullable: true },
        secret: { type: 'boolean', nullable: true },
        isEffect: { type: 'boolean', nullable: true },
        execute: skillExecuteArraySchema,
        cost: skillExecuteArraySchema
    },
    required: [
        'id', 
        'level', 
        'title', 
        'description', 
        'onEnemy', 
        'execute', 
        'cost'
    ]
}

export const characterSchema: JSONSchemaType<Character> = {
    type: 'object',
    properties: {
        characteristics: {
            type: 'object',
            properties: {
                start: characteristicsSchema,
                up: characteristicsSchema
            },
            required: ['start', 'up'],
        },
        skills: {
            type: 'array',
            items: skillSchema
        }
    },
    required: ['characteristics', 'skills']
}

export const cubeDataSchema: JSONSchemaType<CubeData> = {
    type: 'object',
    properties: {
        u: { type: 'number' },
        r: { type: 'number' },
        m: { type: 'number' },
    },
    required: ['r', 'u', 'm']
}

export const scrollerDataSchema: JSONSchemaType<ScrollerData> = {
    type: 'object',
    properties: {
        current: { type: 'number' },
        increase: { type: 'number' },
    },
    required: ['current', 'increase']
}

export const scrollerWithIdDataSchema: JSONSchemaType<ScrollerWithIdData> = {
    type: 'object',
    properties: {
        ...scrollerDataSchema.properties!,
        id: { type: 'number' }
    },
    required: [...scrollerDataSchema.required, 'id']
}

export const userReplyIdsDataSchema: JSONSchemaType<UserReplyIdsData> = {
    type: 'object',
    properties: {
        user: {type: 'number'},
        reply: {type: 'number'},
    },
    required: ['reply', 'user']
}