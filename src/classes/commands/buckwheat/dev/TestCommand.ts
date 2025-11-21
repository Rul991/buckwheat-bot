import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { DEV_ID, MODE } from '../../../../utils/values/consts'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../../utils/MessageUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import ExperienceService from '../../../db/services/level/ExperienceService'
import ExperienceUtils from '../../../../utils/level/ExperienceUtils'
import LevelUtils from '../../../../utils/level/LevelUtils'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { InlineKeyboardButton } from 'telegraf/types'
import MathUtils from '../../../../utils/MathUtils'
import StringUtils from '../../../../utils/StringUtils'

type SecretFunctionOptions = {
    ctx: TextContext
    other: MaybeString
    chatId: number
    id: number
}

export default class TestCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'дев'
        this._isShow = false
    }

    private async _secretFunction({
        ctx,
        other
    }: SecretFunctionOptions) {
        let range: number[][] = ArrayUtils.matrice({
            min: 0,
            max: 100,
            step: 5,
            width: 8
        })

        if (!other) {
            await MessageUtils.answer(
                ctx,
                'Могу предложить вам баквит дев money и баквит дев level'
            )
            return
        }
        else if (other == 'money') {
            range = [
                [
                    -150_000,
                    0,
                    150_000
                ]
            ]
        }
        else if(other == 'level') {
            range = range.map(arr => {
                return arr.map(v => MathUtils.clamp(
                    v, 
                    LevelUtils.min, 
                    LevelUtils.max
                ))
            })
        }

        await MessageUtils.answer(
            ctx,
            'Держи кнопочки:',
            {
                inlineKeyboard: range.map(arr => {
                    return arr.map(v => {
                        return {
                            callback_data: `test_{"type":"${other}","value":${v}}`,
                            text: StringUtils.toFormattedNumber(v)
                        } as InlineKeyboardButton
                    })
                })
            }
        )
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if (MODE == 'dev') {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(ctx, id)
            if (!chatId) return

            await this._secretFunction({ ctx, other, chatId, id })
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/dev/${MODE}.pug`,
            {
                changeValues: {
                    name: ctx.message.text
                }
            }
        )
    }
}