import ReplaceOptions from '../../../interfaces/options/ReplaceOptions'
import { CallbackButtonOptions } from './action-options'
import { ReplaceKeyboardData } from './keyboards'
import { ExtraEditMessageText, InputMediaWrapCaption, TinyCurrentIncreaseId } from './types'

export type NewScrollerData<T> =
    & T
    & (
        TinyCurrentIncreaseId
        | {
            update: boolean
            id?: number
        }
    )

export type ScrollerSlicedObjectsOptions<Object, Additional> =
    & CallbackButtonOptions<NewScrollerData<Additional>>
    & {
        objects: Object[]
        page: number
        maxPage: number
    }

export type ScrollerEditMessageOptions<Object, Additional> =
    & ScrollerSlicedObjectsOptions<Object, Additional>
    & {
        slicedObjects: Object[]
    }

export type ScrollerEditMessageResult = {
    media?: InputMediaWrapCaption
    message?: {
        path: string
        changeValues?: ReplaceOptions['changeValues']
    }
    keyboard: ReplaceKeyboardData
    rawOptions?: ExtraEditMessageText
} | void

export type ArrowsOptions<T> = {
    id?: number
    length: number
    page: number
    update: boolean
    data: T
}