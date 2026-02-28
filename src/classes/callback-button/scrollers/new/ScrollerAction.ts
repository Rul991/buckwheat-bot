import { object, ZodType, boolean, number } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import { tinyCurrentIncreaseIdSchema } from '../../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { ArrowsOptions, NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult, ScrollerSlicedObjectsOptions } from '../../../../utils/values/types/scrollers'
import CacheScrollerObjectsService from '../../../db/services/keyboard/CacheScrollerObjectsService'
import FileUtils from '../../../../utils/FileUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import ContextUtils from '../../../../utils/ContextUtils'
import { ReplaceKeyboardData, Value } from '../../../../utils/values/types/keyboards'

export default abstract class <Object, Additional = {}> extends CallbackButtonAction<NewScrollerData<Additional>> {
    protected abstract _keyboardFilename: string
    protected _objectsPerPage = 5
    protected _minPage = 0

    protected _additionalDataSchema: ZodType<Additional> = object({}) as ZodType<Additional>
    protected _schema: ZodType<NewScrollerData<Additional>> = tinyCurrentIncreaseIdSchema
        .or(
            object({
                update: boolean(),
                id: number().optional(),
            })
        )
        .and(this._additionalDataSchema)

    protected abstract _getRawObjects(options: CallbackButtonOptions<NewScrollerData<Additional>>): Promise<Object[]>
    protected abstract _editMessage(options: ScrollerEditMessageOptions<Object, Additional>): Promise<ScrollerEditMessageResult>

    protected async _getObjects(options: CallbackButtonOptions<NewScrollerData<Additional>>): Promise<Object[]> {
        const {
            ctx,
            chatId: linkedChatId,
            data
        } = options

        const chatId = ctx.chat?.id ?? linkedChatId
        const messageId = ctx.msg.message_id

        let isUpdate = 'update' in data ||
            !Boolean(await CacheScrollerObjectsService.get(chatId, messageId))

        if (!isUpdate) {
            const cached = await CacheScrollerObjectsService.get(
                chatId,
                messageId
            )

            return cached?.objects ?? []
        }

        const rawObjects = await this._getRawObjects(options)
        await CacheScrollerObjectsService.set({
            messageId,
            chatId,
            objects: rawObjects
        })
        return rawObjects
    }

    protected _getMaxPage(length: number) {
        return Math.ceil(length / this._objectsPerPage) - 1
    }

    protected _getPage(data: NewScrollerData<Additional>, maxPage: number) {
        if ('update' in data) {
            return 0
        }

        const {
            c: current,
            i: increase
        } = data

        const minPage = this._minPage

        const rawPage = current + increase
        const page = Math.min(
            Math.max(minPage, rawPage),
            maxPage
        )

        return page
    }

    protected _getArrows({
        id,
        length,
        page,
        update,
        data
    }: ArrowsOptions<NewScrollerData<Additional>>): ReplaceKeyboardData['values'] & {} {
        const minPage = this._minPage
        const maxPage = this._getMaxPage(length)

        const additional = {
            ...data,
            update: undefined,
            id: undefined,
            c: undefined,
            i: undefined
        }

        const pageNavs: Value[] = [
            {
                text: maxPage > 0 ? 
                    `${page + 1} / ${maxPage + 1}` :
                    '🔄 Обновить',
                data: {
                    ...additional,
                    id,
                    update: !update
                }
            }
        ]
        const arrows: Value[] = []

        if (page > minPage) {
            pageNavs.unshift({
                text: `${minPage + 1}`,
                data: {
                    ...additional,
                    c: minPage,
                    i: 0,
                    id
                }
            })

            arrows.unshift({
                text: '<<',
                data: {
                    ...additional,
                    c: page,
                    i: -1,
                    id
                }
            })
        }

        if (page < maxPage) {
            pageNavs.push({
                text: `${maxPage + 1}`,
                data: {
                    ...additional,
                    c: maxPage,
                    i: 0,
                    id
                }
            })

            arrows.push({
                text: '>>',
                data: {
                    ...additional,
                    c: page,
                    i: 1,
                    id
                }
            })
        }

        return {
            pageNav: pageNavs,
            arrow: arrows
        }
    }

    protected async _getSlicedObjects(options: ScrollerSlicedObjectsOptions<Object, Additional>) {
        const {
            objects,
            page
        } = options

        const start = page * this._objectsPerPage
        const end = start + this._objectsPerPage

        const result = objects.slice(
            start,
            end
        )

        return result
    }

    async execute(options: CallbackButtonOptions<NewScrollerData<Additional>>): Promise<string | void> {
        const {
            ctx,
            data
        } = options

        const {
            id,
        } = data
        if (id && await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const objects = await this._getObjects(options)
        const length = objects.length

        const maxPage = this._getMaxPage(length)
        const page = this._getPage(
            data,
            maxPage
        )

        const slicedObjectsOptions = {
            ...options,
            objects,
            page,
            maxPage
        }

        const slicedObjects = await this._getSlicedObjects(slicedObjectsOptions)
        const editMessageResult = await this._editMessage({
            ...slicedObjectsOptions,
            slicedObjects
        })
        if(!editMessageResult) return

        const {
            message,
            media,
            keyboard: replaceKeyboardData,
            rawOptions = {}
        } = editMessageResult

        const update = 'update' in data ?
            data.update :
            false

        const arrows = this._getArrows({
            update,
            length,
            page,
            id,
            data
        })

        const keyboard = await InlineKeyboardManager.get(
            this._keyboardFilename,
            {
                ...replaceKeyboardData,
                values: {
                    ...replaceKeyboardData.values,
                    ...arrows
                }
            }
        )

        if (media) {
            const text = message ?
                await FileUtils.readPugFromResource(
                    message.path,
                    {
                        changeValues: message.changeValues
                    }
                ) :
                undefined

            await MessageUtils.editMedia(
                ctx,
                {
                    ...media,
                    caption: text
                },
                {
                    ...rawOptions,
                    reply_markup: {
                        inline_keyboard: keyboard
                    },
                }
            )
        }
        else if (message) {
            const {
                path,
                changeValues
            } = message

            const text = await FileUtils.readPugFromResource(
                path,
                {
                    changeValues
                }
            )

            await MessageUtils.editText(
                ctx,
                text,
                {
                    ...rawOptions,
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                }
            )
        }
        else {
            await MessageUtils.editMarkup(
                ctx,
                {
                    inline_keyboard: keyboard
                }
            )
        }
    }
}