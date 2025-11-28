import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class InfoCommand extends BuckwheatCommand {
    private static _descriptions: { chance: number, texts: string[] }[] = [
        {
            chance: 0,
            texts: ['Это не случится!']
        },

        {
            chance: 10,
            texts: ['Шанс, что случится это, низок, но не равен нулю!']
        },

        {
            chance: 20,
            texts: ['Вряд ли!']
        },

        {
            chance: 30,
            texts: [
                'Кто знает...'
            ]
        },

        {
            chance: 40,
            texts: [
                'Скорее нет, чем да!'
            ]
        },

        {
            chance: 50,
            texts: ['Может да, а может нет, а может...']
        },

        {
            chance: 60,
            texts: [
                'Скорее да, чем нет!'
            ]
        },

        {
            chance: 80,
            texts: [
                'Похоже на правду!'
            ]
        },

        {
            chance: 90,
            texts: ['Очень вероятно!']
        },

        {
            chance: 100,
            texts: ['Случится, уверяю тебя!']
        }
    ]

    constructor () {
        super()
        this._name = 'инфа'
        this._description = 'показываю с каким шансом это случится'
        this._needData = true
        this._argumentText = 'текст'
    }

    private _getDescription(chance: number): string {
        const otherAnswer = ''

        for (let i = InfoCommand._descriptions.length - 1; i >= 0; i--) {
            const description = InfoCommand._descriptions[i]

            if (description.chance <= chance) {
                return RandomUtils.choose(description.texts) ?? otherAnswer
            }
        }

        return otherAnswer
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const text = other ?? 'ничего'
        const chance = RandomUtils.range(0, 100)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/info/info.pug',
            {
                changeValues: {
                    text,
                    chance,
                    description: this._getDescription(chance)
                }
            }
        )
    }
}