import { BaseScene } from 'telegraf/scenes'
import BaseAction from '../base/BaseAction'
import { AsyncOrSync, SceneContextData } from '../../../utils/values/types/types'
import { Context } from 'telegraf'
import { Update } from 'telegraf/types'

export default abstract class<D extends {}> extends BaseAction {
    protected abstract _execute(scene: BaseScene<Context & SceneContextData<D>>): AsyncOrSync

    async execute(): Promise<BaseScene<Context & SceneContextData<D>>> {
        const scene = new BaseScene<Context<Update> & SceneContextData<D>>(this._name)
        await this._execute(scene)

        return scene
    }
}