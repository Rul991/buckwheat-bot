import MessageUtils from '../../../../utils/MessageUtils'
import { PhotoOptions } from '../../../../utils/values/types/action-options'
import { ActionAccess } from '../../../../utils/values/types/command-access'
import PhotoAction from '../../photo/PhotoAction'

export default class extends PhotoAction {
    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }

    async execute(options: PhotoOptions): Promise<void> {
        const {
            ctx
        } = options

        const {
            height,
            width
        } = ctx.message.photo[0]

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/photo/wrong.pug',
            {
                changeValues: {
                    width,
                    height,
                }
            }
        )
    }
}