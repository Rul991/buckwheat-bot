import AdminCommand from './AdminCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { TextContext } from '../../../../utils/values/types/contexts'
import RankUtils from '../../../../utils/RankUtils'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserRankService from '../../../db/services/user/UserRankService'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'

export default class PinCommand extends BuckwheatCommand {
    protected _folder: string = 'pin'
    protected _isUndoCommand: boolean = false

    constructor () {
        super()

        this._name = 'закреп'
        this._aliases = [
            'пин',
            'закрепить'
        ]
        this._description = 'закрепляю сообщение'
        this._replySupport = true

        this._minimumRank = RankUtils.moderator
    }

    private _getPath(filename: string) {
        return `text/commands/${this._folder}/${filename}.pug`
    }

    protected _do({ ctx }: BuckwheatCommandOptions) {
        return AdminUtils.pin(ctx)
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            chatId,
            id
        } = options

        const changeValues = {
            isUndo: this._isUndoCommand,
            user: await ContextUtils.getUser(chatId, id),
            rank: this._minimumRank
        }

        if (!await UserRankService.has(chatId, id, this._minimumRank)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                this._getPath('rank-issue'),
                {
                    changeValues
                }
            )
            return
        }

        const isDone = await this._do(options)

        if(isDone) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                this._getPath(this._isUndoCommand ? 'undo' : 'done'),
                {
                    changeValues
                }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                this._getPath('cancel'),
                {
                    changeValues
                }
            )
        }
    }
}