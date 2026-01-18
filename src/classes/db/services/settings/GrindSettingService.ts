import { Context } from 'telegraf'
import Chat from '../../../../interfaces/schemas/chat/Chat'
import UserSettingsService from './UserSettingsService'

export default class {
    static async isSendMessage(ctx: Context & {chat: Chat}, id: number) {
        const isPrivate = ctx.chat.type == 'private'
        const isGrind = await UserSettingsService.get<'boolean'>(id, 'grind')

        return !(isGrind && isPrivate)
    }
}