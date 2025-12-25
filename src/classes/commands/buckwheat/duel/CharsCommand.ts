import Characteristics from '../../../../interfaces/duel/Characteristics'
import ClassUtils from '../../../../utils/ClassUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import DuelUtils from '../../../../utils/DuelUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import { HP_SYMBOLS, MANA_SYMBOLS, MAX_STATS_SYMBOLS_COUNT } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import DuelistService from '../../../db/services/duelist/DuelistService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class CharsCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'характеристики'
        this._description = 'показываю ваши характеристики',
            this._aliases = [
                'хп',
                'мана'
            ]
        this._replySupport = true
    }

    private _getId({ replyOrUserFrom }: BuckwheatCommandOptions): number {
        return replyOrUserFrom.id
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const { ctx, chatId } = options
        const id = this._getId(options)
        const className = await UserClassService.get(chatId, id)
        const user = await ContextUtils.getUser(chatId, id)

        if (!await UserClassService.isPlayer(chatId, id)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/chars/unknown.pug',
                {
                    changeValues: {
                        ...user
                    }
                }
            )
            return
        }

        const current = await DuelistService.getCurrentCharacteristics(chatId, id)
        const max = await DuelistService.getMaxCharacteristics(chatId, id, className)

        const getProgress = (
            key: keyof Characteristics
        ): string => {
            return DuelUtils.getProgress(
                current,
                max,
                key
            )
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/chars/info.pug',
            {
                changeValues: {
                    ...user,
                    mana: getProgress('mana'),
                    hp: getProgress('hp'),
                    className: ClassUtils.getName(className)
                }
            }
        )
    }
}