import { JSONSchemaType } from 'ajv'
import MessageUtils from '../../../../utils/MessageUtils'
import Pager from '../../../../utils/Pager'
import { CallbackButtonContext, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types'
import CallbackButtonAction from '../../CallbackButtonAction'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import FileUtils from '../../../../utils/FileUtils'

export default abstract class ScrollerAction<T> extends CallbackButtonAction<string> {
    protected _objectsPerPage: number = 0
    protected _schema: JSONSchemaType<string> = {type: 'string'}
    protected abstract _getObjects(ctx: CallbackButtonContext, id: number): AsyncOrSync<T[]>

    protected _getSlicedObjects(objects: T[], currentPage: number): T[] {
        if(this._objectsPerPage <= 0) return objects
        return objects
            .slice(
                this._objectsPerPage * currentPage,
                this._objectsPerPage * (currentPage + 1)
            )
    }

    protected _getData(raw: string): string {
        return raw
    }

    protected _getId(ctx: CallbackButtonContext, data: string): AsyncOrSync<number> {
        return ctx.from.id
    }
    
    protected _getLength(ctx: CallbackButtonContext, objects: T[]): AsyncOrSync<number> {
        if(this._objectsPerPage <= 0) return objects.length
        return Math.ceil(objects.length / this._objectsPerPage)
    }

    protected abstract _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<T>): Promise<ScrollerEditMessageResult>

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const id = await this._getId(ctx, data)
        const objects = await this._getObjects(ctx, id)
        const length = await this._getLength(ctx, objects)

        const currentPage = Pager.wrapPages(data, length)
        if(currentPage == NOT_FOUND_INDEX) 
            return await FileUtils.readPugFromResource('text/actions/scroller/no-page.pug')

        const editedMessage = await this._editMessage(ctx, {
            currentPage,
            length,
            objects: this._getSlicedObjects(objects, currentPage),
            data,
            id
        })

        if(typeof editedMessage == 'string') 
            return editedMessage
        else if(editedMessage === null)
            return

        const {text, options} = editedMessage
        await MessageUtils.editText(
            ctx,
            text,
            options
        )
    }
}