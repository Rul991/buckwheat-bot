import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import RoleplayUtils from '../../../utils/RoleplayUtils'
import { MaybeString, TextContext } from '../../../utils/values/types'
import SimpleBuckwheatCommand from './SimpleBuckwheatCommand'

export default class RoleplayCommand extends SimpleBuckwheatCommand {
    static async loadFromJsonResource(path: string): Promise<RoleplayCommand> {
        return await super.loadFromJsonResource(path) as RoleplayCommand
    }

    protected async _sendMessageBySrc(ctx: TextContext, src: string): Promise<void> {
        const text = await FileUtils.readPugFromResource(src)
        await this._sendMessageByText(ctx, text)
    }

    protected async _sendMessageByText(ctx: TextContext, text: string): Promise<void> {
        await MessageUtils.answer(
            ctx,
            await RoleplayUtils.getMessage(ctx, text)
        )
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        super.execute(ctx, other)
    }
}