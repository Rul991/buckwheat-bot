import { ZodType } from 'zod'
import { craftSchema } from '../../../utils/values/schemas'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CraftData from '../../../interfaces/callback-button-data/CraftData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'
import RecipeService from '../../db/services/items/RecipeService'

type Data = CraftData

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = craftSchema

    constructor () {
        super()
        this._name = 'craft'
        this._buttonTitle = 'Крафт'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            data,
            chatId
        } = options

        const {
            id,
            index,
            count = 1
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const result = await RecipeService.craft({
            chatId,
            id,
            index,
            count
        })

        const {
            done,
            reason
        } = result

        if (done) {
            await MessageUtils.editTextFromResource(
                ctx,
                'text/commands/recipe/crafted.pug',
                {
                    inlineKeyboard: await InlineKeyboardManager.get(
                        'recipes/back',
                        {
                            globals: {
                                ...data
                            }
                        }
                    )
                }
            )
            return await FileUtils.readPugFromResource(
                'text/commands/recipe/crafted.pug'
            )
        }
        else {
            return await FileUtils.readPugFromResource(
                `text/commands/recipe/cant/${reason}.pug`
            )
        }
    }
}