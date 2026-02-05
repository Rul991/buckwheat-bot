import FileUtils from '../../utils/FileUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import DuelistService from '../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

type Data = [number, number]

export default class extends SkillMethod<Data> {
    args: JavascriptTypes[] = ['number']

    protected async _getRawDamage({
        args: [damage]
    }: MethodExecuteOptions<Data>) {
        return damage
    }

    protected async _getDamage(options: MethodExecuteOptions<Data>) {
        const {
            boost
        } = options

        const rawDamage = await this._getRawDamage(options)
        const damage = rawDamage * boost

        return damage
    }

    protected async _preCheck({ }: MethodExecuteOptions<Data>): Promise<boolean> {
        return true
    }

    protected async _execute(options: MethodExecuteOptions<Data>): Promise<boolean> {
        const {
            id,
            chatId
        } = options

        const damage = await this._getDamage(options)

        await DuelistService.addField(
            chatId,
            id,
            'hp',
            -damage
        )

        return true
    }

    protected async _getText(options: MethodGetTextOptions<Data>): Promise<string> {
        const damage = await this._getDamage(options)
        return await FileUtils.readPugFromResource(
            'text/methods/damage.pug',
            {
                changeValues: {
                    damage
                }
            }
        )
    }
}