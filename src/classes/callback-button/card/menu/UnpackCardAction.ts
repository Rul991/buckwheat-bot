import { ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import ContextUtils from '../../../../utils/ContextUtils'
import FileUtils from '../../../../utils/FileUtils'
import CardService from '../../../db/services/card/CardService'
import CardsService from '../../../db/services/card/CardsService'
import MessageUtils from '../../../../utils/MessageUtils'
import CardUtils from '../../../../utils/CardUtils'
import InventoryItemService from '../../../db/services/items/InventoryItemService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { idSchema } from '../../../../utils/values/schemas'

type Data = {
    id: number
}

type GiveCardOptions = {
    ctx: CallbackButtonContext,
    chatId: number,
    id: number,
    data: Data
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
    protected _buttonTitle?: string | undefined = "Карты: Распаковка"

    constructor () {
        super()
        this._name = 'cunpk'
    }

    private async _giveCard({
        ctx,
        id,
        chatId,
        data: {
            id: dataId
        }
    }: GiveCardOptions): Promise<string | void> {
        const card = await CardService.getRandom()
        const inlineKeyboard = await InlineKeyboardManager.get(
            'cards/unpack',
            {
                id: JSON.stringify({ id: dataId })
            }
        )

        if (card) {
            const {
                id: cardId,
                image,
                rarity
            } = card

            const inventoryCard = await CardsService.getCard(
                chatId,
                id,
                cardId
            )

            const count = inventoryCard?.count ?? 0

            await CardsService.addCard(
                chatId,
                id,
                cardId
            )

            await MessageUtils.answerPhoto(
                ctx,
                await FileUtils.readPugFromResource(
                    'text/commands/cards/unpacked.pug',
                    {
                        changeValues: {
                            card,
                            emoji: CardUtils.getEmoji(rarity),
                            rarityName: CardUtils.getName(rarity),
                            isDuplicate: count > 0
                        }
                    }
                ),
                image,
                {
                    inlineKeyboard
                }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cards/unpacked.pug',
                {
                    changeValues: {
                        card: null
                    },
                    inlineKeyboard
                }
            )
        }

        await MessageUtils.deleteMessage(ctx)
        return await FileUtils.readPugFromResource(
            'text/actions/cards/unpacked.pug',
            {
                changeValues: {
                    name: card?.name
                }
            }
        )
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        if (ctx.chat?.type != 'private') {
            return await FileUtils.readPugFromResource(
                'text/actions/other/only-private.pug'
            )
        }

        const {
            id
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const [isUsed] = await InventoryItemService.use(chatId, id, 'cardBox')

        if (isUsed) {
            await this._giveCard({ ctx, chatId, id, data })
        }
        else {
            return await FileUtils.readPugFromResource(
                'text/commands/cards/no-box.pug'
            )
        }
    }
}