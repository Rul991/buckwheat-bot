import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../../utils/values/types/contexts'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import { DEV_ID } from '../../../../utils/values/consts'
import FileUtils from '../../../../utils/FileUtils'
import CardUtils from '../../../../utils/CardUtils'
import CardService from '../../../db/services/card/CardService'
import MessageUtils from '../../../../utils/MessageUtils'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'

type Data = {
    a: 0 | 1,
    id: number,
    c: number
    p: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            a: {
                type: 'number',
                enum: [0, 1]
            },
            id: {
                type: 'number'
            },
            c: {
                type: 'number'
            },
            p: {
                type: 'number'
            }
        },
        required: ['a', 'id', 'c', 'p']
    }

    constructor () {
        super()
        this._name = 'cadd'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            a: isAdd,
            id,
            c: cardId,
            p: currentPage
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return
        if (id != DEV_ID) return await FileUtils.readPugFromResource(
            'text/other/not-dev.pug'
        )

        const card = await CardService.get(cardId)
        if (!card) {
            return await FileUtils.readPugFromResource(
                'text/commands/cards/no-card.pug',
                {
                    changeValues: {
                        id: cardId
                    }
                }
            )
        }

        if (isAdd) {
            await CardService.setSuggested(
                cardId,
                false
            )
        }
        else {
            await CardService.delete(cardId)
        }

        const suggestedCards = await CardService.getSuggested()
        const newPage = ArrayUtils.getNearIndex(currentPage, suggestedCards)
        const newCard = suggestedCards[newPage] ?? CardUtils.getUnknown(true)
        const length = suggestedCards.length

        if (!length) {
            await MessageUtils.deleteMessage(ctx)
        }
        else {
            const editedMessage = await CardUtils.getEditedMessage({
                card: newCard,
                length,
                currentPage: newPage,
                inlineKeyboardFilename: 'suggest',
                id
            })

            if (typeof editedMessage == 'object' && editedMessage !== null) {
                const {
                    media,
                    text,
                    options
                } = editedMessage

                await MessageUtils.editMedia(
                    ctx,
                    {
                        ...media!,
                        caption: text
                    },
                    options
                )
            }
        }

        return await FileUtils.readPugFromResource(
            'text/commands/cards/add.pug',
            {
                changeValues: {
                    name: card.name,
                    isAdd
                }
            }
        )
    }

}