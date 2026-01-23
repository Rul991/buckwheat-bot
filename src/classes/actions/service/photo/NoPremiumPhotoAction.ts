import MessageUtils from '../../../../utils/MessageUtils'
import { PhotoOptions } from '../../../../utils/values/types/action-options'
import { ActionAccess } from '../../../../utils/values/types/command-access'
import PhotoAction from '../../photo/PhotoAction'

export default class extends PhotoAction {
    protected _settingId: string = ''
    get actionAccesses(): ActionAccess[] {
        return []
    }
    
    async execute({ ctx }: PhotoOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/other/no-premium.pug'
        )
    }
}