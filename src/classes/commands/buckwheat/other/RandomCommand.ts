import MessageUtils from '../../../../utils/MessageUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import StringUtils from '../../../../utils/StringUtils'
import { MaybeString, TextContext } from '../../../../utils/values/types/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class RandomCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'рандом'
        this._description = 'Вывожу рандомное число в заданном диапазоне'
        this._needData = true
        this._argumentText = '<минимум> <максимум>'
    }

    private _getRange(other: MaybeString): [number, number] {
        const defaultRange: [number, number] = [0, 100]
        if(!other) return defaultRange

        const splittedOther = StringUtils.splitBySpace(other, 2)
        if(splittedOther.length < 2) return defaultRange

        const splittedNumber = splittedOther.map(v => +v)
        const isHasNaN = splittedNumber.some(v => isNaN(v))

        if(isHasNaN)
            return defaultRange

        return splittedNumber
            .sort()
            .map(v => Math.floor(v)) as [number, number]
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const [min, max] = this._getRange(other)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/random/random.pug',
            {
                changeValues: {
                    min,
                    max,
                    value: RandomUtils.range(min, max)
                }
            }
        )
    }
}