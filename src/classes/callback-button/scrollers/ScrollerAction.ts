import MessageUtils from '../../../utils/MessageUtils'
import Pager from '../../../utils/Pager'
import { CallbackButtonContext, AsyncOrSync, ScrollerSendMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'

export default abstract class ScrollerAction<T> extends CallbackButtonAction {
    protected _objectsPerPage: number = 1
    protected abstract _getObjects(ctx: CallbackButtonContext): AsyncOrSync<T[]>
    
    protected _getLength(ctx: CallbackButtonContext, objects: T[]): AsyncOrSync<number> {
        return Math.ceil(objects.length / this._objectsPerPage)
    }

    protected abstract _editMessage(ctx: CallbackButtonContext, options: ScrollerSendMessageOptions<T>): Promise<
        | ScrollerEditMessageResult 
        | string 
        | null
    >

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const objects = await this._getObjects(ctx)
        const length = await this._getLength(ctx, objects)

        const currentPage = Pager.wrapPages(data, length)
        if(currentPage == -1) return 'Такой страницы нет!'

        const editedMessage = await this._editMessage(ctx, {
            currentPage,
            length,
            objects,
            data
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