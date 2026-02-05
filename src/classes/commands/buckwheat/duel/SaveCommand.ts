import AdminUtils from '../../../../utils/AdminUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { SAVE_COOLDOWN } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import DuelistService from '../../../db/services/duelist/DuelistService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type HealOptions = {
    ctx: TextContext, 
    isSendMessages: boolean, 
    chatId: number, 
    id: number
}

export default class SaveCommand extends BuckwheatCommand {
    protected _settingId: string = 'save'
    protected _canBeChanged: boolean = false

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

    private async _heal({
        chatId,
        id,
        isSendMessages,
        ctx
    }: HealOptions): Promise<boolean> {
        const lastSave = await DuelistService.getField(chatId, id, 'lastSave')
        const isCanSave = lastSave ? TimeUtils.isTimeExpired(SAVE_COOLDOWN, lastSave) : true

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

    async execute({ ctx, other, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const isLeave = this._isLeave(other)
        const isCanSave = await this._heal({
            ctx, 
            isSendMessages: !isLeave,
            chatId,
            id
        })

        if(isLeave) {
            await this._leave(ctx, isCanSave)
        }
    }
}