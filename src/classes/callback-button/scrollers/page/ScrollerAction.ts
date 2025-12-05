import { JSONSchemaType } from 'ajv'
import MessageUtils from '../../../../utils/MessageUtils'
import Pager from '../../../../utils/Pager'
import { CallbackButtonContext, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult, ScrollerGetObjectsOptions } from '../../../../utils/values/types/types'
import CallbackButtonAction from '../../CallbackButtonAction'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import FileUtils from '../../../../utils/FileUtils'

export default abstract class ScrollerAction<T, D = string> extends CallbackButtonAction<string> {
    protected _objectsPerPage: number = 0
    protected _schema: JSONSchemaType<string> = { type: 'string' }
    protected abstract _getObjects(ctx: CallbackButtonContext, { id }: ScrollerGetObjectsOptions<D>): AsyncOrSync<T[]>

    protected _getSlicedObjects(objects: T[], currentPage: number): T[] {
        if (this._objectsPerPage <= 0) return objects
        return objects
            .slice(
                this._objectsPerPage * currentPage,
                this._objectsPerPage * (currentPage + 1)
            )
    }

    protected _getData(raw: string): string {
        return raw
    }

    protected _convertDataToObject(raw: string): D {
        return raw as D
    }

    protected _getId(ctx: CallbackButtonContext, data: D): AsyncOrSync<number> {
        return ctx.from.id
    }

    protected _getLength(ctx: CallbackButtonContext, objects: T[]): AsyncOrSync<number> {
        if (this._objectsPerPage <= 0) return objects.length
        return Math.ceil(objects.length / this._objectsPerPage)
    }

    protected abstract _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<T, D>): Promise<ScrollerEditMessageResult>

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const convertedData = this._convertDataToObject(data)
        const id = await this._getId(ctx, convertedData)
        const objects = await this._getObjects(ctx, { id, data: convertedData })
        const length = await this._getLength(ctx, objects)

        const currentPage = Pager.wrapPages(data, length)
        if (currentPage == NOT_FOUND_INDEX)
            return await FileUtils.readPugFromResource('text/actions/scroller/no-page.pug')

        const editedMessage = await this._editMessage(ctx, {
            currentPage,
            length,
            objects: this._getSlicedObjects(objects, currentPage),
            data: convertedData,
            id
        })

        if (typeof editedMessage == 'string')
            return editedMessage
        else if (editedMessage === null)
            return

        const { text, options, media } = editedMessage

        if(media) {
            await MessageUtils.editMedia(
                ctx,
                {
                    ...media,
                    caption: text,
                },
                options
            )
        }
        else {
            await MessageUtils.editText(
                ctx,
                text,
                options
            )
        }
    }
}