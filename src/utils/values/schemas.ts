import SimpleCommand from '../../interfaces/other/SimpleComand'
import { SchemaObject } from './types'

export const simpleCommandSchema: SchemaObject<SimpleCommand> = {
    avoidOther: ['undefined', 'string'],
    src: ['string', 'array', 'undefined'],
    text: ['string', 'array', 'undefined'],
    name: 'string'
}