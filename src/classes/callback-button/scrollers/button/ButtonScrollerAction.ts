import { ZodType } from 'zod'
import ButtonScrollerData from '../../../../interfaces/callback-button-data/ButtonScrollerData'
import { AsyncOrSync, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, ButtonScrollerOptions, ButtonScrollerSlice, CallbackButtonValue, CurrentIncreaseIdNames, CreateNavButtonsOptions } from '../../../../utils/values/types/types'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import { FIRST_INDEX, MAX_BUTTONS_IN_HORISONTAL, MAX_BUTTONS_PER_PAGE } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import NavigationButtonUtils from '../../../../utils/NavigationButtonUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { tinyCurrentIncreaseIdSchema } from '../../../../utils/values/schemas'

export default abstract class<O, D extends Record<string, any> = ButtonScrollerData> extends CallbackButtonAction<D> {
    protected _schema: ZodType<D> = tinyCurrentIncreaseIdSchema as any

    protected _buttonsPerPage: number = MAX_BUTTONS_PER_PAGE
    protected _maxRowWidth: number = MAX_BUTTONS_IN_HORISONTAL
    protected abstract _filename: string

    protected abstract _getObjects({}: ButtonScrollerOptions<D>): Promise<O[]>
    protected abstract _editText({}: ButtonScrollerFullOptions<O, D>): AsyncOrSync<ButtonScrollerEditMessageResult>

    protected _getSlice(data: D): ButtonScrollerSlice {
        const newPage = this._getNewPage(data)
        const start = newPage * this._buttonsPerPage
        const end = (newPage + 1) * this._buttonsPerPage

        return {
            start,
            end,
            new: newPage
        }
    }

    protected _getNewPage(data: D) {
        const {
            current,
            increase
        } = this._getCurrentIncreaseIdNames()

        const result = data[current] + data[increase]
        return isNaN(result) ? FIRST_INDEX : result
    }

    protected _getCurrentIncreaseIdNames(): CurrentIncreaseIdNames<D> {
        return {
            current: 'c',
            increase: 'i',
            id: 'id'
        }
    }

    protected _getPageNav({
        data,
        objects,
    }: ButtonScrollerFullOptions<O, D>): CallbackButtonValue[] {
        const length = objects.length
        const id = data.id as number | undefined
        
        const {
            new: newPage
        } = this._getSlice(data)

        const {
            id: idName,
            current,
            increase,
            data: dataName
        } = this._getCurrentIncreaseIdNames()

        return NavigationButtonUtils.getPageNav({
            buttonsPerPage: this._buttonsPerPage,
            current: current as string,
            increase: increase as string,
            id: id ? {
                name: idName as string,
                value: id
            } : undefined,
            length,
            pageIndex: newPage,
            data: {
                name: dataName as string,
                value: data['data'] ?? undefined
            }
        })
    }

    protected _createNavButton(options: CreateNavButtonsOptions): CallbackButtonValue {
        return NavigationButtonUtils.createNavButton(options)
    }

    protected _getArrows({
        data,
        objects,
    }: ButtonScrollerFullOptions<O, D>): CallbackButtonValue[] {
        const id = data.id as number | undefined
        const length = objects.length

        const {
            start,
            end,
            new: pageIndex
        } = this._getSlice(data)

        const {
            id: idName,
            current,
            increase
        } = this._getCurrentIncreaseIdNames()

        return NavigationButtonUtils.getArrows({
            length,
            start,
            end,
            pageIndex,
            id: id ? {
                name: idName as string,
                value: id
            } : undefined,
            increase: increase as string,
            current: current as string,
            buttonsPerPage: this._buttonsPerPage
        })
    }

    protected _getSlicedObjects(objects: O[], options: ButtonScrollerOptions<D>): AsyncOrSync<O[]> {
        const {
            data
        } = options

        const {
            start,
            end
        } = this._getSlice(data)

        return objects.slice(
            start,
            end
        )
    }

    async execute({ctx, data, chatId, id}: CallbackButtonOptions<D>): Promise<string | void> {
        const {
            id: needId,
        } = data
        if(needId && await ContextUtils.showAlertIfIdNotEqual(ctx, needId)) return
    
        const options = {
            chatId,
            id,
            data,
            ctx
        }

        const objects = await this._getObjects(options)
        const slicedObjects = await this._getSlicedObjects(
            objects, 
            options
        )

        const fullOptions = {
            ...options,
            objects,
            slicedObjects
        }

        const editedText = await this._editText(fullOptions)
        if(typeof editedText == 'string') {
            return editedText
        }

        const {
            text,
            values
        } = editedText

        const {
            globals,
            values: buttons
        } = values
        
        const keyboard = await LegacyInlineKeyboardManager.map(
            this._filename, 
            {
                globals,
                values: {
                    arrow: this._getArrows(fullOptions),
                    pageNav: this._getPageNav(fullOptions),
                    ...buttons,
                },
                maxWidth: this._maxRowWidth
            }
        )
        const markup = {
            inline_keyboard: keyboard
        }

        if(text) {
            await MessageUtils.editText(
                ctx, 
                text, 
                {
                    reply_markup: markup
                }
            )
        }
        else {
            await MessageUtils.editMarkup(
                ctx,
                markup
            )
        }
    }
}