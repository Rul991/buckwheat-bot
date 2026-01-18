import BaseHandler from './BaseHandler'
import SceneAction from '../../actions/scenes/SceneAction'
import { Stage } from 'telegraf/scenes'
import { MyTelegraf } from '../../../utils/values/types/types'
import ArrayContainer from '../containers/ArrayContainer'

export default class extends BaseHandler<
    SceneAction<any>, 
    ArrayContainer<SceneAction<any>>
> {
    constructor() {
        super(new ArrayContainer())
    }

    async setup(bot: MyTelegraf): Promise<void> {
        const result: any = []
        await this._container.forEach(async action => {
            const scene = await action.execute()
            result.push(scene)
        })

        const stage = new Stage(result)
        bot.use(stage.middleware() as any)
    }
}