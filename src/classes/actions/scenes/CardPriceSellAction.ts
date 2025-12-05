import { Context } from 'telegraf'
import { BaseScene } from 'telegraf/scenes'
import { Update } from 'telegraf/types'
import Card from '../../../interfaces/schemas/card/Card'
import { SceneContextData, TextContext } from '../../../utils/values/types/types'
import SceneAction from './SceneAction'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import CardUtils from '../../../utils/CardUtils'
import { MAX_CARD_PRICE, MIN_CARD_PRICE } from '../../../utils/values/consts'
import StringUtils from '../../../utils/StringUtils'
import ShopCardService from '../../db/services/card/ShopCardService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MathUtils from '../../../utils/MathUtils'

type Data = {
    card: Card
}

type CreateShopCardOptions = {
    id: number,
    chatId: number,
    card: Data['card'],
    price: number
}

export default class extends SceneAction<Data> {
    constructor () {
        super()
        this._name = 'card-price-sell'
    }

    private async _createShopCard({
        id,
        chatId,
        price,
        card
    }: CreateShopCardOptions) {
        const {
            id: cardId,
        } = card

        await ShopCardService.create({
            chatId,
            seller: id,
            card: cardId,
            price
        })
    }

    private _getPrice(text: string) {
        const price = StringUtils.getNumberFromString(text)

        return MathUtils.clamp(
            price, 
            MIN_CARD_PRICE, 
            MAX_CARD_PRICE
        )
    }

    protected _execute(scene: BaseScene<Context<Update> & SceneContextData<Data>>): void {
        scene.enter(async ctx => {
            const {
                card
            } = ctx.scene.state

            const {
                name,
                description,
                image,
                rarity,
            } = card

            await MessageUtils.answerPhoto(
                ctx,
                await FileUtils.readPugFromResource(
                    'text/commands/cards/shop/sell.pug',
                    {
                        changeValues: {
                            name,
                            description,
                            emoji: CardUtils.getEmoji(rarity),
                            rarityName: CardUtils.getName(rarity),
                            minPrice: StringUtils.toFormattedNumber(MIN_CARD_PRICE),
                            maxPrice: StringUtils.toFormattedNumber(MAX_CARD_PRICE)
                        }
                    }
                ),
                image
            )
        })

        scene.on('text', async ctx => {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(ctx, id)
            if(!chatId) return

            const text = ctx.text
            const price = this._getPrice(text)

            const {
                card
            } = ctx.scene.state

            const {
                name
            } = card

            await this._createShopCard({
                chatId,
                id,
                price,
                card
            })

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cards/shop/sold.pug',
                {
                    changeValues: {
                        name,
                        price: StringUtils.toFormattedNumber(price)
                    }
                }
            )

            await ctx.scene.leave()
        })
    }
}