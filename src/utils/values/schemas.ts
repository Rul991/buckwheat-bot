import SimpleCommand from '../../interfaces/other/SimpleComand'
import { NewInvoiceParameters, SchemaObject, ShopItem } from './types'

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

export const invoiceSchema: SchemaObject<NewInvoiceParameters> = {
    description: 'string',
    title: 'string',
    payload: 'string',
    prices: 'array',
    max_tip_amount: ['number', 'undefined'],
    suggested_tip_amounts: ['array', 'undefined'],
    start_parameter: ['string', 'undefined'],
    provider_data: ['string', 'undefined'],
    photo_url: ['string', 'undefined'],
    photo_size: ['number', 'undefined'],
    photo_width: ['number', 'undefined'],
    photo_height: ['number', 'undefined'],
    need_name: ['boolean', 'undefined'],
    need_phone_number: ['boolean', 'undefined'],
    need_email: ['boolean', 'undefined'],
    need_shipping_address: ['boolean', 'undefined'],
    send_phone_number_to_provider: ['boolean', 'undefined'],
    send_email_to_provider: ['boolean', 'undefined'],
    is_flexible: ['boolean', 'undefined'],
    protect_content: ['boolean', 'undefined']
}