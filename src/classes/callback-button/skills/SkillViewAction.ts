import { JSONSchemaType } from 'ajv'
import { ClassTypes } from '../../../utils/values/types/types'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ChoosedSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../db/services/user/UserClassService'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ClassUtils from '../../../utils/ClassUtils'
import SkillUtils from '../../../utils/SkillUtils'
import DuelService from '../../db/services/duel/DuelService'
import { InlineKeyboardButton } from 'telegraf/types'
import Skill from '../../../interfaces/duel/Skill'
import ChosenSkillsService from '../../db/services/choosedSkills/ChosenSkillsService'
import { NOT_FOUND_INDEX } from '../../../utils/values/consts'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Types = 'd' | 'v' | 'a'

type Keyboard = InlineKeyboardButton.CallbackButton[][]

type Data = {
    id: number
    index: number | string,
    type?: Types
}

type ResolveOptions = Data & {
    chatId: number
}

type ResolveResult = {
    id: number,
    keyboard: Keyboard
    isSecret: boolean
} | null

type SkillMessageOptions = {
    getTextsOptions: {
        ctx: CallbackButtonContext
        skill: Skill
    }
    isSecret: boolean
    classType: ClassTypes
    keyboard: Keyboard
}

type SkillOptions = {
    chatId: number,
    usedId: number,
    index: number | string
    classType: ClassTypes
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: { type: 'number' },
            index: { type: ['number', 'string'] },
            type: { type: 'string', nullable: true }
        },
        required: ['id', 'index']
    }

    constructor () {
        super()
        this._name = 'skillview'
    }

    private async _getViewData({
        id,
        index,
        type,
        chatId
    }: ResolveOptions): Promise<ResolveResult> {
        let usedId = id
        let duelId = NOT_FOUND_INDEX
        let keyboard: Keyboard = []
        let isSecret = false

        if (type == 'd') {
            const duel = await DuelService.get(id)
            if (!duel) return null

            usedId = duel.step.duelist
            duelId = duel.id

            const type = await UserClassService.get(chatId, usedId)
            const skills = await ChosenSkillsService.getSkills(chatId, usedId)

            keyboard = await InlineKeyboardManager.get('duels/view', {
                duel: JSON.stringify({ duel: duelId }),
                alert: JSON.stringify({
                    type,
                    id: usedId
                }),
                skill: JSON.stringify({ name: skills[index as number] }),
            })
            isSecret = true
        }
        else if (type == 'a') {
            keyboard = await InlineKeyboardManager.get('skills/add', {
                id: JSON.stringify({ id }),
                skillId: JSON.stringify({ skillId: index })
            })
        }
        else {
            keyboard = await InlineKeyboardManager.get('skills/view', {
                index: JSON.stringify({ index }),
                id: JSON.stringify({ id })
            })
        }

        return {
            id: usedId,
            keyboard,
            isSecret,
        }
    }

    private async _sendSkillMessage({
        keyboard,
        classType,
        getTextsOptions: getTextOptions,
        isSecret
    }: SkillMessageOptions): Promise<void> {
        const { ctx, skill } = getTextOptions

        const text = await SkillUtils.getViewText(
            {
                isSecret,
                skill,
                ctx,
                classType
            }
        )

        await MessageUtils.editText(
            ctx,
            text,
            {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            }
        )
    }

    private async _getSkill({
        index,
        classType,
        chatId,
        usedId
    }: SkillOptions): Promise<Skill | undefined> {
        let skillId: string

        if (typeof index == 'string') {
            skillId = index
        }
        else {
            const skills = await ChoosedSkillsService.getSkills(chatId, usedId)
            skillId = skills[index]
        }

        return await SkillUtils.getSkillById(classType, skillId)
    }

    async execute({ ctx, data: { id, index, type }, chatId }: CallbackButtonOptions<Data>): Promise<string | void> {
        const viewData = await this._getViewData({ id, index, type, chatId })
        if (!viewData) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')

        const { id: usedId, keyboard, isSecret } = viewData
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, usedId)) return

        const classType = await UserClassService.get(chatId, usedId)
        const skill = await this._getSkill({
            chatId,
            usedId,
            index,
            classType
        })
        if (!skill) return await FileUtils.readPugFromResource('text/actions/skill/hasnt.pug')

        const getTextsOptions = { skill, ctx }
        await this._sendSkillMessage({
            getTextsOptions,
            keyboard,
            isSecret,
            classType
        })
    }

}