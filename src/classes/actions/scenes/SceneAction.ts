import { BaseScene } from 'telegraf/scenes'
import BaseAction from '../base/BaseAction'
import { AsyncOrSync } from '../../../utils/values/types/types'
import { ContextData } from '../../../utils/values/types/contexts'
import { Context } from 'telegraf'
import { Update } from 'telegraf/types'
import { SceneOptions } from '../../../utils/values/types/action-options'

export default abstract class<D extends {}> extends BaseAction {
    protected abstract _execute(options: SceneOptions<D>): AsyncOrSync

    async execute(): Promise<BaseScene<Context & ContextData<D>>> {
        const scene = new BaseScene<Context<Update> & ContextData<D>>(this._name)
        await this._execute({
            scene
        })

        return scene
    }
}