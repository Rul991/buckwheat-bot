import { Context } from 'telegraf'
import { BaseScene } from 'telegraf/scenes'
import { Update } from 'telegraf/types'
import { SceneContextData } from '../../../utils/values/types/types'
import SceneAction from './SceneAction'
import Card from '../../../interfaces/schemas/card/Card'
import { FIRST_INDEX, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '../../../utils/values/consts'
import CardUtils from '../../../utils/CardUtils'
import MessageUtils from '../../../utils/MessageUtils'
import CardService from '../../db/services/card/CardService'
import StringUtils from '../../../utils/StringUtils'

enum WrongParseResult {
    NoValue,
    WrongPartsLength,
    BigName,
    BigDescription,
    RarityNotNumber,
    RarityOutBounds
}

type Data = {}

export default class extends SceneAction<Data> {
    constructor() {
        super()
        this._name = 'suggest-card'
    }

    protected _parseText(text: string | undefined, photo: string): Omit<Card, 'id'> | WrongParseResult {
        if(!text) return WrongParseResult.NoValue

        const parts = text
            .split('\n')
            .map(v => v.trim())
            .filter(v => v.length > 0)
        if(parts.length < 3) return WrongParseResult.WrongPartsLength

        const [rawName, description, rarity] = parts
        if(description.length > MAX_DESCRIPTION_LENGTH) return WrongParseResult.BigDescription

        const name = rawName.replaceAll('\n', '')
        if(name.length > MAX_NAME_LENGTH) return WrongParseResult.BigName

        const rawRarity = StringUtils.getNumberFromString(rarity)
        if(isNaN(rawRarity)) return WrongParseResult.RarityNotNumber
        
        const numberRarity = rawRarity - 1
        if(numberRarity < FIRST_INDEX || numberRarity > CardUtils.maxRarity) return WrongParseResult.RarityOutBounds

        return {
            name,
            description,
            rarity: numberRarity,
            isSuggested: true,
            image: photo
        }
    }

    protected async _execute(scene: BaseScene<Context<Update> & SceneContextData<Data>>): Promise<void> {
        scene.enter(async ctx => {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/suggest-card/enter.pug',
                {
                    changeValues: {
                        nameLength: MAX_NAME_LENGTH,
                        descriptionLength: MAX_DESCRIPTION_LENGTH
                    }
                }
            )
        })

        scene.on('photo', async ctx => {
            const {
                file_id: photo
            } = ctx.message.photo[0]
            const text = ctx.text

            const result = this._parseText(
                text, 
                photo
            )

            if(typeof result == 'object') {
                await CardService.create(result)
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/suggested.pug',
                    {
                        changeValues: {
                            ...result
                        }
                    }
                )
            }
            else if(result == WrongParseResult.BigDescription) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/big-description.pug',
                    {
                        changeValues: {
                            length: MAX_DESCRIPTION_LENGTH
                        }
                    }
                )
            }
            else if(result == WrongParseResult.BigName) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/big-name.pug',
                    {
                        changeValues: {
                            length: MAX_NAME_LENGTH
                        }
                    }
                )
            }
            else if(result == WrongParseResult.NoValue) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/no-value.pug'
                )
            }
            else if(result == WrongParseResult.RarityNotNumber) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/rarity-not-number.pug'
                )
            }
            else if(result == WrongParseResult.RarityOutBounds) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/rarity-out-bounds.pug'
                )
            }
            else if(result == WrongParseResult.WrongPartsLength) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/scenes/suggest-card/wrong/wrong-parts-length.pug'
                )
            }
        })

        scene.on('message', async ctx => {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/suggest-card/no-photo.pug'
            )
            await ctx.scene.leave()
        })
    }
}