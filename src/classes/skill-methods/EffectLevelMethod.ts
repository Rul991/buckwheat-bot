import { JavascriptTypes, MethodExecuteArguments } from '../../utils/values/types/types'
import LevelService from '../db/services/level/LevelService'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, number, number]> {
    args: JavascriptTypes[] = ['string', 'number', 'number']

    protected async _getRawSteps({
        args: [_name, baseSteps, perStep],
        chatId,
        id
    }: MethodExecuteArguments<[string, number, number]>): Promise<number> {
        const level = await LevelService.get(chatId, id)
        return baseSteps + (level - 1) * perStep
    }
}