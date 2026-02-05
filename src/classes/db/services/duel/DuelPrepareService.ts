import ContextUtils from '../../../../utils/ContextUtils'
import DuelPrepareUtils from '../../../../utils/duel/DuelPrepareUtils'
import { LinkWithPrice } from '../../../../utils/values/types/duels'
import LevelService from '../level/LevelService'

export default class {
    static async getPrice(chatId: number, id: number) {
        const level = await LevelService.get(chatId, id)
        const price = DuelPrepareUtils.getPrice(level)

        return price
    }

    static async getDuelistLinkWithPrice(chatId: number, id: number): Promise<LinkWithPrice> {
        const link = await ContextUtils.getUser(chatId, id)
        const price = await this.getPrice(chatId, id)

        return {
            ...link,
            price
        }
    }
}