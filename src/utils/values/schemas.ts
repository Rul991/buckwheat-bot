import SimpleCommand from '../../interfaces/other/SimpleComand'
import { SchemaObject, ShopItem } from './types'

export const simpleCommandSchema: SchemaObject<SimpleCommand> = {
    avoidOther: ['undefined', 'boolean'],
    src: ['string', 'array', 'undefined'],
    text: ['string', 'array', 'undefined'],
    name: 'string'
}

export const shopItemSchema: SchemaObject<ShopItem> = {
    name: 'string',
    description: 'string',
    emoji: 'string',
    price: 'number',
    maxCount: ['number', 'undefined'],
    cooldown: ['number', 'undefined'],
    filename: ['string', 'undefined'],
    execute: ['function', 'undefined'],
    isPremium: ['boolean', 'undefined']
}