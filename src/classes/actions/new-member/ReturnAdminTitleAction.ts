import AdminUtils from '../../../utils/AdminUtils'
import { NewMemberOptions } from '../../../utils/values/types/action-options'
import AdminTitleService from '../../db/services/user/AdminTitleService'
import NewMemberAction from './NewMemberAction'

export default class extends NewMemberAction {
    constructor() {
        super()
    }

    async execute(options: NewMemberOptions): Promise<void> {
        const {
            chatId,
            id,
            ctx
        } = options

        const adminTitle = await AdminTitleService.get(
            chatId,
            id
        )

        if(adminTitle?.length) {
            await AdminUtils.setAdminTitle(
                ctx,
                id,
                adminTitle
            )
        }
    }
}