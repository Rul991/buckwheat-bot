import { CallbackButtonValue, MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import { BROADCAST_TIME, DEV_ID, MILLISECONDS_IN_SECOND, MODE } from '../../../../utils/values/consts'
import MessageUtils from '../../../../utils/MessageUtils'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChatService from '../../../db/services/chat/ChatService'
import { sleep } from '../../../../utils/values/functions'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import ArrayUtils from '../../../../utils/ArrayUtils'
import MathUtils from '../../../../utils/MathUtils'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'

type SecretFunctionOptions = {
    ctx: TextContext
    other: MaybeString
    chatId: number
    id: number
}

export default class TestCommand extends BuckwheatCommand {
    protected _settingId: string = 'dev'
    protected _canBeChanged: boolean = false

    constructor () {
        super()
        this._name = 'дев'
        this._isShow = false
    }

    private async _secretFunction({
        ctx,
        chatId,
        id,
        other
    }: SecretFunctionOptions) {
        type Button = {
            values: number[]
            min?: number
            max?: number
        }
        const buttons: Record<string, Button> = {
            level: {
                values: ArrayUtils.range(0, 100, 5),
                min: 1,
                max: 99
            },
            money: {
                values: ArrayUtils.range(-1_500_000, 1_500_000, 500_000)
            }
        }

        const getValues = (
            key: MaybeString
        ): CallbackButtonValue[] => {
            if (!key) return []
            if (!other) return []

            const button = buttons[key]
            if (!button) return []

            const {
                min = Number.MIN_SAFE_INTEGER,
                max = Number.MAX_SAFE_INTEGER
            } = button

            const values = button.values
                .map(v => {
                    return MathUtils.clamp(v, min, max)
                })

            return values.map(v => {
                return {
                    text: `${other}:${v}`,
                    data: JSON.stringify({
                        type: other,
                        value: v
                    })
                }
            })
        }

        await MessageUtils.answer(
            ctx,
            other ?? 'test',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.map(
                    'test',
                    {
                        values: {
                            btn: getValues(other)
                        },
                        maxWidth: 3
                    }
                )
            }
        )
    }

    async execute({ ctx, other, id, chatId }: BuckwheatCommandOptions): Promise<void> {
        if (MODE == 'dev' || (id == DEV_ID && other == '!')) {
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