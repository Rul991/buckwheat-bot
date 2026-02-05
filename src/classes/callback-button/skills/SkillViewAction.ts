import { literal, number, object, string, ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { idSchema } from '../../../utils/values/schemas'
import { InlineKeyboardButton } from 'telegraf/types'
import DuelService from '../../db/services/duel/DuelService'
import SkillService from '../../db/services/chosen-skills/SkillService'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'
import { Ids } from '../../../utils/values/types/types'
import SkillUtils from '../../../utils/skills/SkillUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import SkillAttack from '../../../enums/SkillAttack'
import SkillTextUtils from '../../../utils/skills/SkillTextUtils'
import DuelUtils from '../../../utils/duel/DuelUtils'

type DataTypes = 'a' | 'v' | 'd'
type IndexTypes = {
    d: number
    a: string
    v: number
}

type Data = {
    [K in DataTypes]: {
        id: number
        index: IndexTypes[K],
        type?: K
    }
}[DataTypes]

type ViewDataResult = {
    keyboard: InlineKeyboardButton.CallbackButton[][]
    userId: number
    enemyId?: number
    isSecret?: boolean
}

type ViewData<Data> = {
    callback: (options: CallbackButtonOptions<Data>) => Promise<ViewDataResult | null>
}

type GetSkillOptions = Ids & {
    index: IndexTypes[DataTypes]
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle: string = 'Навык: Просмотр'
    protected _schema: ZodType<Data> = idSchema
        .and(
            object({
                index: number(),
                type: literal('d')
            })
                .or(
                    object({
                        index: number(),
                        type: literal('v')
                    })
                )
                .or(
                    object({
                        index: string(),
                        type: literal('a')
                    })
                )
                .or(
                    object({
                        index: number(),
                    })
                )
        )

    private _viewDatas: Record<DataTypes, ViewData<Data>> = {
        d: {
            callback: async options => {
                const {
                    data,
                    chatId
                } = options

                const {
                    id,
                    index: rawIndex
                } = data

                const duel = await DuelService.get(id)
                if (!duel) return null

                const duelId = duel.id
                const index = rawIndex as number
                const userId = duel.steps.at(-1)!.duelist

                const skills = await SkillService.get(chatId, userId)
                const skill = skills[index] ?? ''

                return {
                    keyboard: await LegacyInlineKeyboardManager.get(
                        'duels/view',
                        {
                            duel: JSON.stringify({ duel: duelId }),
                            alert: JSON.stringify({
                                id: userId
                            }),
                            skill: JSON.stringify({ name: skill }),
                        }
                    ),
                    userId,
                    enemyId: DuelUtils.getEnemy(duel, userId),
                    isSecret: true
                }
            }
        },

        a: {
            callback: async options => {
                const {
                    data,
                } = options

                const {
                    id,
                    index
                } = data

                return {
                    keyboard: await LegacyInlineKeyboardManager.get('skills/add', {
                        skillId: JSON.stringify({ skill: index }),
                        id: JSON.stringify({ id })
                    }),
                    userId: id,
                }
            }
        },

        v: {
            callback: async options => {
                const {
                    data,
                } = options

                const {
                    id,
                    index
                } = data

                return {
                    keyboard: await LegacyInlineKeyboardManager.get('skills/view', {
                        index: JSON.stringify({ index }),
                        id: JSON.stringify({ id })
                    }),
                    userId: id,
                }
            }
        }
    }
    private _undefinedViewData = this._viewDatas.v

    private async _getViewData(options: CallbackButtonOptions<Data>) {
        const {
            type
        } = options.data

        const viewData = !(type && this._viewDatas[type]) ?
            this._undefinedViewData :
            this._viewDatas[type]

        return await viewData.callback(options)
    }

    private async _getSkill({ id, chatId, index }: GetSkillOptions) {
        let skillId: string

        if (typeof index == 'string') {
            skillId = index
        }
        else {
            const skills = await SkillService.get(chatId, id)
            skillId = skills[index]
        }

        return SkillUtils.getSkillById(skillId)
    }

    constructor () {
        super()
        this._name = 'skillview'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const viewData = await this._getViewData(options)
        if (!viewData) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')

        const {
            data,
            chatId,
            ctx
        } = options

        const {
            index
        } = data

        const {
            userId: id,
            enemyId,
            keyboard
        } = viewData

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return
        const skill = await this._getSkill({ id, chatId, index })

        await MessageUtils.editText(
            ctx,
            await SkillTextUtils.message({
                ctx,
                userId: id,
                enemyId,
                chatId,
                skill
            }),
            {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            }
        )
    }

}