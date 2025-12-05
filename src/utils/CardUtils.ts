import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import ReplaceOptions from '../interfaces/options/ReplaceOptions'
import Card from '../interfaces/schemas/card/Card'
import Cards from '../interfaces/schemas/card/Cards'
import FileUtils from './FileUtils'
import RandomUtils from './RandomUtils'
import StringUtils from './StringUtils'
import { ScrollerEditMessage } from './values/types/types'

type GetEditedMessageOptions = {
    card: Card
    currentPage: number
    count?: number
    id: number
    inlineKeyboardFilename: string
    textFilename?: string
    length: number
    changeValues?: ReplaceOptions['changeValues']
}

export default class {
    private static _rarityName = [
        'Обычный',
        'Необычный',
        'Редкий',
        'Эпический',
        'Легендарный',
        'Уникальный',
        'Неизвестный'
    ]

    private static _rarityEmoji = [
        '⚪️',
        '🔵',
        '🟢',
        '🟣',
        '🟡',
        '🔴',
        '⚫️'
    ]

    private static _rarityChance = 0.4
    static maxRarity = this._rarityName.length - 2

    static getName(number: number) {
        return this._rarityName[number] ??
            this._rarityName[this.maxRarity]
    }

    static getEmoji(number: number) {
        return this._rarityEmoji[number] ??
            this._rarityEmoji[this.maxRarity]
    }

    static getRarity() {
        let result = 0

        while (result < this.maxRarity) {
            if (RandomUtils.chance(this._rarityChance)) {
                result++
            }
            else {
                break
            }
        }

        return result
    }

    static getUnknown(isSuggested = false): Card {
        return {
            id: -1,
            name: 'Неизвестный',
            description: 'Этой карточки на самом деле не существует',
            image: '',
            rarity: this._rarityEmoji.length - 1,
            isSuggested
        }
    }

    static async getEditedMessage({
        card,
        inlineKeyboardFilename,
        textFilename = 'card',
        currentPage,
        id,
        count = 0,
        length,
        changeValues = {}
    }: GetEditedMessageOptions): Promise<ScrollerEditMessage> {
        const {
            id: cardId,
            name,
            description,
            image,
            rarity,
            isSuggested
        } = card

        return {
            text: await FileUtils.readPugFromResource(
                `text/commands/cards/${textFilename}.pug`,
                {
                    changeValues: {
                        name,
                        description,
                        isSuggested,
                        count: StringUtils.toFormattedNumber(count),
                        emoji: this.getEmoji(rarity),
                        rarityName: this.getName(rarity),
                        currentPage: StringUtils.toFormattedNumber(currentPage + 1),
                        length: StringUtils.toFormattedNumber(length),
                        ...changeValues,
                    }
                }
            ),
            options: {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.get(
                        `cards/${inlineKeyboardFilename}`,
                        {
                            page: currentPage,
                            id,
                            cardId
                        }
                    )
                }
            },
            media: {
                type: 'photo',
                media: image
            }
        }
    }

    static getTotalCount(cards: Cards['cards']) {
        return cards.reduce((prev, {count}) => {
            return prev + count
        }, 0)
    }
}