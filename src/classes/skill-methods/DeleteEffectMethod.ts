import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import SkillMethod from './SkillMethod'

type Data = [string, boolean]

export default class extends SkillMethod<Data> {
    args: JavascriptTypes[] = ['string', 'boolean']

    protected async _preCheck({ }: MethodExecuteOptions<Data>): Promise<boolean> {
        return true
    }

    protected async _execute({ }: MethodExecuteOptions<Data>): Promise<boolean> {

    }

    protected async _getText({ }: MethodGetTextOptions<Data>): Promise<string> {

    }
}