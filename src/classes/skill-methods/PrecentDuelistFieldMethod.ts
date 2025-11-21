import DuelUtils from '../../utils/DuelUtils'
import SkillMethodUtils from '../../utils/SkillMethodTextsUtils'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, SkillMethodGetText, HpMana } from '../../utils/values/types'
import DuelistService from '../db/services/duelist/DuelistService'
import LevelService from '../db/services/level/LevelService'
import UserClassService from '../db/services/user/UserClassService'
import SkillMethod from './SkillMethod'

type Type = HpMana

export default class extends SkillMethod<[number]> {
    private _emoji: string
    private _type: Type
    
    args: JavascriptTypes[] = ['number']

    constructor(emoji: string, type: Type) {
        super()
        this._emoji = emoji
        this._type = type
    }

    protected async _preCheck({}: MethodExecuteArguments<[number]>): Promise<boolean> {
        return true
    }

    protected async _execute({
        chatId,
        id,
        args: [value]
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        const type = await UserClassService.get(chatId, id)
        const level = await LevelService.get(chatId, id)
        const maxChars = await DuelUtils.getMaxCharacteristicsFromFile(type, level)
        if(!maxChars) return false

        const charValue = maxChars[this._type]
        const addedValue = charValue * 0.01 * value

        await DuelistService.addField(
            chatId,
            id,
            this._type,
            addedValue
        )
        return true
    }

    async getText({
        skill: { onEnemy },
        args: [value]
    }: MethodExecuteArguments<[number]> & SkillMethodGetText): Promise<string> {
        return await SkillMethodUtils.getAddCharPrecentsMessage(
            value,
            onEnemy,
            this._emoji
        )
    }

}