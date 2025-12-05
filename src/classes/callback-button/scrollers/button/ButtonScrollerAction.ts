import { JSONSchemaType } from 'ajv'
import ButtonScrollerData from '../../../../interfaces/callback-button-data/ButtonScrollerData'
import { AsyncOrSync, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, ButtonScrollerOptions, ButtonScrollerSlice, CallbackButtonContext, CallbackButtonValue, CurrentIncreaseIdNames, CreateNavButtonsOptions } from '../../../../utils/values/types/types'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { FIRST_INDEX, MAX_BUTTONS_IN_HORISONTAL, MAX_BUTTONS_PER_PAGE } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import FileUtils from '../../../../utils/FileUtils'
import NavigationButtonUtils from '../../../../utils/NavigationButtonUtils'

export default abstract class<O, D extends Record<string, any> = ButtonScrollerData> extends CallbackButtonAction<D> {
    protected _schema: JSONSchemaType<D> = {
        type: 'object',
        properties: {
            current: { type: 'number' },
            increase: { type: 'number' },
            id: {type: 'number', nullable: true}
        },
        required: ['current', 'increase']
    }

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
            current: 'current',
            increase: 'increase',
            id: 'id'
        }
    }

    protected _getPageNav({
        data,
        objects,
        id
    }: ButtonScrollerFullOptions<O, D>): CallbackButtonValue[] {
        const length = objects.length
        
        const {
            new: newPage
        } = this._getSlice(data)

        const {
            id: idName,
            current,
            increase
        } = this._getCurrentIncreaseIdNames()

        return NavigationButtonUtils.getPageNav({
            buttonsPerPage: this._buttonsPerPage,
            current: current as string,
            increase: increase as string,
            id: {
                name: idName as string,
                value: id
            },
            length,
            pageIndex: newPage
        })
    }

    protected _createNavButton(options: CreateNavButtonsOptions): CallbackButtonValue {
        return NavigationButtonUtils.createNavButton(options)
    }

    protected _getArrows({
        data,
        objects,
        id
    }: ButtonScrollerFullOptions<O, D>): CallbackButtonValue[] {
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
            id: {
                name: idName as string,
                value: id
            },
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

    async execute(ctx: CallbackButtonContext, data: D): Promise<string | void> {
        const {
            id: needId,
        } = data
        if(needId && await ContextUtils.showAlertIfIdNotEqual(ctx, needId)) return
    
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, needId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

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
        
        const keyboard = await InlineKeyboardManager.map(
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