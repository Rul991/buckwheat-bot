import { JSONSchemaType } from 'ajv'
import ButtonScrollerData from '../../../../interfaces/callback-button-data/ButtonScrollerData'
import { AsyncOrSync, ButtonScrollerFullOptions, ButtonScrollerEditMessageResult, ButtonScrollerOptions, ButtonScrollerSlice, CallbackButtonContext, CallbackButtonValue } from '../../../../utils/values/types'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { FIRST_INDEX, MAX_BUTTONS_PER_PAGE } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import FileUtils from '../../../../utils/FileUtils'

export default abstract class<O, D extends ButtonScrollerData = ButtonScrollerData> extends CallbackButtonAction<D> {
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

    protected _getNewPage({current, increase}: D) {
        return current + increase
    }

    protected _getArrows({
        data,
        objects
    }: ButtonScrollerFullOptions<O, D>): CallbackButtonValue[] {
        const arrows: CallbackButtonValue[] = []
        const length = objects.length
        const {
            start,
            end,
            new: newPage
        } = this._getSlice(data)
        
        const addArrow = (onLeft: boolean) => 
            arrows.push({
                text: onLeft ? '<<' : '>>',
                data: JSON.stringify({current: newPage, increase: onLeft ? -1 : 1})
            })

        if(start > FIRST_INDEX) {
            addArrow(true)
        }

        if(end < length) {
            addArrow(false)
        }

        return arrows
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

        const {
            text,
            values
        } = await this._editText(fullOptions)

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
                    ...buttons,
                }
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