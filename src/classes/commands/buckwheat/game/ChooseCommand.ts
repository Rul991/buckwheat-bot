import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import StringUtils from '../../../../utils/StringUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ChooseCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'выбери'
        this._description = 'выбираю одно из ваших слов'
        this._aliases = [
            'выбор',
            'выбрать'
        ]
    }

    private _getRandomWord(text: string): string {
        return RandomUtils.choose(StringUtils.splitBySpace(text)) ?? 'ничего'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
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