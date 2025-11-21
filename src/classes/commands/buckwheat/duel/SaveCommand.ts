import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { SAVE_COOLDOWN } from '../../../../utils/values/consts'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import DuelistService from '../../../db/services/duelist/DuelistService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class SaveCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'сохраниться'
        this._aliases = [
            'сохранится',
            'вылечиться'
        ]
        this._description = 'сохраняю вас на чекпоинте и восстанавливаю вас'
    }

    private _isLeave(other: MaybeString): boolean {
        return other?.toLowerCase() == 'и выйти'
    }

    private async _leave(ctx: TextContext, isCanSave: boolean): Promise<void> {
        const isKicked = await AdminUtils.kick(ctx, ctx.from.id)
        const filename = isKicked ? 'leave' : 'cant-leave'

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/save/${filename}.pug`,
            {
                changeValues: {
                    ...await ContextUtils.getUserFromContext(ctx),
                    isCanSave
                }
            }
        )
    }

    private async _heal(ctx: TextContext, isSendMessages: boolean): Promise<boolean> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return false
        
        const lastSave = await DuelistService.getField(chatId, id, 'lastSave')
        const isCanSave = lastSave ? Date.now() - SAVE_COOLDOWN >= lastSave : true

        if(isCanSave) {
            await DuelistService.save(chatId, id)
        }

        if(isSendMessages) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/save/${isCanSave ? 'save' : 'cant-save'}.pug`,
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, id),
                        time: TimeUtils.toHHMMSS(SAVE_COOLDOWN - (Date.now() - (lastSave ?? 0)))
                    }
                }
            )
        }

        return isCanSave
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const isLeave = this._isLeave(other)

        const isCanSave = await this._heal(ctx, !isLeave)

        if(isLeave) {
            await this._leave(ctx, isCanSave)
        }
    }
}