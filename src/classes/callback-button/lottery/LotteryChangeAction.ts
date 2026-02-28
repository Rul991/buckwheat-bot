import Lottery from '../../../interfaces/schemas/lottery/Lottery'
import LotteryTicketUtils from '../../../utils/lottery/LotteryTicketUtils'
import StringUtils from '../../../utils/StringUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import LotteryService from '../../db/services/lottery/LotteryService'
import ScrollerAction from '../scrollers/new/ScrollerAction'

type T = Lottery
type A = {

}

export default class extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'lottery/change'

    constructor () {
        super()
        this._name = 'lotterychg'
        this._buttonTitle = 'Лотерея: Пролистывание'
    }

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<Lottery[]> {
        const {
            chatId
        } = options

        return await LotteryService.getAllPublic(chatId)
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Lottery, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            page,
            id
        } = options

        return {
            message: {
                path: 'text/commands/lottery/start.pug'
            },
            keyboard: {
                values: {
                    lottery: slicedObjects.map(({ price, id, tickets }) => {
                        const {
                            min,
                            max
                        } = LotteryTicketUtils.getMinMaxPrize(tickets)

                        return {
                            text: `${min} - ${max}💰 | ${StringUtils.toFormattedNumber(price)}💰`,
                            data: {
                                page,
                                lottery: id
                            }
                        }
                    })
                },
                globals: {
                    id
                }
            }
        }
    }
}