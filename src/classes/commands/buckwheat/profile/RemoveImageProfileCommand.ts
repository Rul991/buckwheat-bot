import MessageUtils from '../../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import UserProfileService from '../../../db/services/user/UserProfileService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class extends BuckwheatCommand {
    protected _settingId: string = 'remove-ava'

    constructor() {
        super()
        this._name = 'ава'
        this._aliases = [
            'аватарка'
        ]
        this._description = 'удаляю пользовательскую аватарку'
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            chatId,
            id,
            ctx
        } = options

        await UserProfileService.update(
            chatId,
            id,
            {
                imageId: ''
            }
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/profile/remove-image.pug'
        )
    }
}