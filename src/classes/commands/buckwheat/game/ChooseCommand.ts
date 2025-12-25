import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import StringUtils from '../../../../utils/StringUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ChooseCommand extends BuckwheatCommand {
    private _separator = ';'

    constructor() {
        super()
        this._name = 'выбери'
        this._description = `выбираю одну из ваших фраз, разделенных "${this._separator}"`
        this._aliases = [
            'выбор',
            'выбрать'
        ]
    }

    private _getRandomWord(text: string): string {
        return RandomUtils.choose(StringUtils.splitAndTrim(text, this._separator)) ?? 'ничего'
    }

    async execute({ ctx, other }: BuckwheatCommandOptions): Promise<void> {
        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/choose/error.pug',
                {
                    changeValues: {
                        word: this._getRandomWord(ctx.text)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/choose/choosed.pug',
            {
                changeValues: {
                    word: this._getRandomWord(other)
                }
            }
        )
    }
}