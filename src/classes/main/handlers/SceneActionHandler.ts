import { Telegraf } from 'telegraf'
import BaseHandler from './BaseHandler'
import SceneAction from '../../actions/scenes/SceneAction'
import { Stage } from 'telegraf/scenes'
import { MyTelegraf } from '../../../utils/values/types/types'

export default class extends BaseHandler<
    SceneAction<{}>, 
    SceneAction<{}>[], 
    typeof SceneAction<{}>
> {
    constructor() {
        super([], SceneAction)
    }

    async setup(bot: MyTelegraf): Promise<void> {
        const result: any = []
        for (const action of this._container) {
            const scene = await action.execute()
            result.push(scene)
        }

        const stage = new Stage(result)
        bot.use(stage.middleware() as any)
    }
}