import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelService from '../../db/services/duel/DuelService'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import MessageUtils from '../../../utils/MessageUtils'
import DuelStepUtils from '../../../utils/duel/DuelStepUtils'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import UserClassService from '../../db/services/user/UserClassService'
import DuelUtils from '../../../utils/duel/DuelUtils'
import ContextUtils from '../../../utils/ContextUtils'
import { ClassTypes, Link } from '../../../utils/values/types/types'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import DuelistService from '../../db/services/duelist/DuelistService'
import StringUtils from '../../../utils/StringUtils'
import { HP_SYMBOLS, MANA_SYMBOLS, MAX_STATS_SYMBOLS_COUNT } from '../../../utils/values/consts'
import CharacteristicsProgressService from '../../db/services/duel/CharacteristicsProgressService'

type Data = {
    id: number
}

type Chars = {
    hp: string
    mana: string
}

type LinkAndChars = Link & Chars

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Меню"

    constructor () {
        super()
        this._name = 'duelfight'
    }

    private async _getUser(chatId: number, id: number, classType?: ClassTypes): Promise<LinkAndChars> {
        const link = await ContextUtils.getUser(chatId, id)
        return {
            ...link,
            ...(await CharacteristicsProgressService.get(chatId, id, classType))
        }
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId,
            id,
        } = options

        const {
            id: duelId
        } = data

        const duel = await DuelService.get(duelId)
        if (!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')
        if (await DuelCheckService.showAlertIfCantUse({ ctx, userId: id, duelId: duel })) return

        const className = await UserClassService.get(chatId, id)
        const {
            duelist: youId
        } = DuelStepUtils.getCurrent(duel.steps)!
        const enemyId = DuelUtils.getEnemy(duel, youId)

        const you = await this._getUser(chatId, youId, className)
        const enemy = await this._getUser(chatId, enemyId)
        const steps = duel.steps.length

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/duel/fight/fight.pug',
                {
                    changeValues: {
                        you,
                        enemy,
                        steps
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        'duels/fight',
                        {
                            globals: {
                                duelId,
                                userId: id,
                                skillId: `attack-${className}`
                            }
                        }
                    )
                }
            }
        )
    }
}