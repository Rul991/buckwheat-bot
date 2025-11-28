import { HasOtherChangeProfileMessage, NoOtherChangeProfileMessage } from '../../../../utils/values/types/types'
import { DEFAULT_DESCRIPTION, MAX_DESCRIPTION_LENGTH } from '../../../../utils/values/consts'
import UserDescriptionService from '../../../db/services/user/UserDescriptionService'
import ChangeProfileCommand from './ChangeProfileCommand'

export default class ChangeDescriptionCommand extends ChangeProfileCommand {
    protected _folderName: string = 'change-description'
    protected _maxLength: number = MAX_DESCRIPTION_LENGTH
    
    constructor() {
        super()
        this._name = 'описание'
        this._description = 'меняю вам описание профиля в беседе'
        this._argumentText = 'описание'
    }

    protected async _sendMessageIfNoOther(options: NoOtherChangeProfileMessage): Promise<void> {
        const { chatId, id } = options
        await UserDescriptionService.update(chatId, id, DEFAULT_DESCRIPTION)
        await super._sendMessageIfNoOther(options)
    }

    protected async _updateProfile({ other, chatId, id, }: HasOtherChangeProfileMessage): Promise<void> {
        await UserDescriptionService.update(chatId, id, other)
    }
}