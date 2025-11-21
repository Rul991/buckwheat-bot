import { HasOtherChangeProfileMessage, TextContext } from '../../../../utils/values/types'
import { MAX_NAME_LENGTH } from '../../../../utils/values/consts'
import UserNameService from '../../../db/services/user/UserNameService'
import MessageUtils from '../../../../utils/MessageUtils'
import ChangeProfileCommand from './ChangeProfileCommand'
import ContextUtils from '../../../../utils/ContextUtils'

export default class ChangeNameCommand extends ChangeProfileCommand {
    protected _folderName: string = 'change-name'
    protected _maxLength: number = MAX_NAME_LENGTH

    constructor () {
        super()
        this._name = 'ник'
        this._description = 'показываю или меняю вам имя в беседе'
        this._argumentText = 'имя'
        this._aliases = ['имя']
    }

    private async _sendMessageIfNameExist({
        chatId,
        ctx,
        other: name
    }: HasOtherChangeProfileMessage) {
        const names = await UserNameService.getAll(chatId)

        if (names.includes(name)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/change-name/exist.pug',
                {
                    changeValues: {
                        name
                    }
                }
            )
            return true
        }

        return false
    }

    protected async _updateProfile({ other, chatId, id, }: HasOtherChangeProfileMessage): Promise<void> {
        await UserNameService.update(chatId, id, other)
    }

    protected async _getUpdateMessageChangeValues(options: HasOtherChangeProfileMessage): Promise<Record<string, any>> {
        const { ctx } = options
        return {
            ...await super._getUpdateMessageChangeValues(options),
            firstName: ContextUtils.getUserOrBotFirstName(ctx)
        }
    }

    protected async _canSendMessageIfHasOther(options: HasOtherChangeProfileMessage) {
        if (!await super._canSendMessageIfHasOther(options)) return false
        if (await this._sendMessageIfNameExist(options)) return false

        return true
    }
}