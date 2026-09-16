import type { Message } from "@bufbuild/protobuf"
import type { BaseScrollerData } from "../../../../protos/scroller_pb"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult, ScrollerButtonEditMessageResult } from "../../../../types/results"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { InlineKeyboard } from "grammy"
import type { InlineKeyboardButton } from "grammy/types"
import MathUtils from "../../../../utils/math/MathUtils"
import Logger from "../../../../utils/logs/Logger"
import ScrollerCacheService from "../../../../db/services/scroller-cache/ScrollerCacheService"
import ScrollerCache from "../../../../db/entities/scroller-cache/ScrollerCache"

type GetNavButtonScrollerDataOptions = {
    update: boolean
    id?: bigint
}

type GetArrowButtonScrollerDataOptions = {
    page: number
    maxPage: number,
    increase: number
    id?: bigint
}

export default abstract class ScrollerButton<O, M extends Omit<BaseScrollerData, '$typeName' | '$unknown'> & Message<any> = BaseScrollerData> extends CallbackQueryAction<M> {
    private static _minPage = 0

    protected _objectsPerPage = 5
    protected _isNeedCache = true

    override defaultTextKey: string = 'scroller/arrow'
    protected _arrowTextKey = 'scroller/arrow'
    protected _navTextKey = 'scroller/nav'
    protected _zeroPagesKey = 'scroller/zero-pages'

    protected abstract _getRawObjects(options: CallbackQueryActionOptions<M>): Promise<O[]>
    protected abstract _editMessage(options: ScrollerButtonEditMessageOptions<O, M>): Promise<ScrollerButtonEditMessageResult>

    protected async _getObjects(options: CallbackQueryActionOptions<M>): Promise<O[]> {
        const {
            ctx,
            data
        } = options
        const chatId = ctx.chatId
        const msgId = ctx.msgId
        if (!(chatId && msgId)) return await this._getRawObjects(options)

        const isUpdate = !this._isNeedCache || data.data?.data.case == 'update'
        const cachedObjects = isUpdate ?
            undefined :
            await ScrollerCacheService.get(chatId, msgId)

        if (cachedObjects) return cachedObjects.objects

        const rawObjects = await this._getRawObjects(options)
        await ScrollerCacheService.create(
            new ScrollerCache({
                chatId,
                msgId,
                objects: rawObjects
            })
        )
        return rawObjects
    }

    protected async _getKeyboard(_options: ScrollerButtonEditMessageOptions<O, M>): Promise<InlineKeyboard> {
        return new InlineKeyboard()
    }

    protected _getArrowButtonScrollerData({
        page,
        maxPage,
        increase,
        id
    }: GetArrowButtonScrollerDataOptions): M['data'] {
        const value = MathUtils.wrap(page + increase, ScrollerButton._minPage, maxPage - 1)
        Logger.debug('ScrollerButton._getArrowButtonScrollerData', { page, maxPage, increase, value })
        return {
            $typeName: 'ScrollerData',
            data: {
                case: 'page',
                value,
            },
            id
        }
    }

    protected _getNavButtonScrollerData({
        update,
        id
    }: GetNavButtonScrollerDataOptions): M['data'] {
        return {
            $typeName: 'ScrollerData',
            data: {
                case: 'update',
                value: !update
            },
            id
        }
    }


    protected async _getControlsButtonData(_options: ScrollerButtonEditMessageOptions<O, M>): Promise<Omit<M, 'data' | '$typeName' | '$unknown'>> {
        return {

        } as M
    }

    protected async _getControlsButtons(options: ScrollerButtonEditMessageOptions<O, M>): Promise<InlineKeyboardButton[]> {
        const {
            ctx,
            page,
            maxPage,
            data
        } = options
        const bigId = data.data?.id

        const result: InlineKeyboardButton[] = [
            this.button({
                ctx,
                key: this._navTextKey,
                data: {
                    ...await this._getControlsButtonData(options),
                    data: this._getNavButtonScrollerData({
                        update: Boolean(data.data?.data.value),
                        id: bigId
                    })
                } as M,
                vars: {
                    page: {
                        current: page,
                        max: maxPage,
                    }
                }
            })
        ]

        const createArrowOptions = async (increase: number) => {
            return {
                ctx,
                key: this._arrowTextKey,
                data: {
                    ...await this._getControlsButtonData(options),
                    data: this._getArrowButtonScrollerData({
                        page,
                        maxPage,
                        increase,
                        id: bigId
                    })
                } as M,
                vars: {
                    page: {
                        current: page,
                        max: maxPage,
                        increase
                    }
                }
            }
        }

        if (maxPage > ScrollerButton._minPage + 1) {
            result.push(
                this.button(await createArrowOptions(1))
            )
            result.unshift(
                this.button(await createArrowOptions(-1))
            )
        }

        return result
    }

    protected _getStartIndex(page: number): number {
        return page * this._objectsPerPage
    }

    protected _getEndIndex(page: number): number {
        return this._getStartIndex(page) + this._objectsPerPage
    }

    protected _getSlicedObjects(page: number, objects: O[]): O[] {
        const start = this._getStartIndex(page)
        const end = this._getEndIndex(page)
        return objects.slice(start, end)
    }

    protected override async _getId(options: CallbackQueryActionOptions<M>): Promise<number | undefined> {
        const {
            data
        } = options

        const id = data.data?.id
        return id !== undefined ? Number(id) : undefined
    }

    protected override async _execute(options: CallbackQueryActionOptions<M>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            chatId,
            id
        } = options

        const {
            data: scrollerData
        } = data
        if (!scrollerData) return

        const {
            case: scrollerCase,
            value: scrollerValue
        } = scrollerData.data

        const page = scrollerCase == 'page' ?
            scrollerValue :
            ScrollerButton._minPage
        const objects = await this._getObjects(options)

        const maxPage = Math.ceil(objects.length / this._objectsPerPage)
        const slicedObjects = this._getSlicedObjects(page, objects)

        if (objects.length <= 0) {
            return {
                key: this._zeroPagesKey
            }
        }

        const scrollerButtonOptions = {
            ctx,
            page,
            maxPage,
            objects,
            slicedObjects,
            data,
            chatId,
            id
        }

        const editMessageResult = await this._editMessage(scrollerButtonOptions)
        const keyboard = (await this._getKeyboard(scrollerButtonOptions))
            .row()

        for (const button of await this._getControlsButtons(scrollerButtonOptions)) {
            if (!button) {
                keyboard.row()
                continue
            }

            keyboard.add(button)
        }

        const {
            key,
            vars,
            media
        } = editMessageResult

        if (media) {
            await MessageUtils.editMedia(
                ctx,
                media.fileId,
                {
                    type: media.type,
                    vars,
                    keyboard,
                    key
                }
            )
        }
        else {
            await MessageUtils.editText(
                ctx,
                key,
                {
                    vars,
                    keyboard
                }
            )
        }
    }
}