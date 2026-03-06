import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import { COMMANDS_PER_PAGE } from '../../../../utils/values/consts'
import { CommandDescription } from '../../../../utils/values/types/types'
import ScrollerAction from '../new/ScrollerAction'
import { object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/scrollers'

type T = CommandDescription
type A = {
    type: string
}

export default class CommandsChangeAction extends ScrollerAction<T, A> {
    protected _keyboardFilename: string = 'commands/change'
    protected _buttonTitle: string = 'Команды: Пролистывание'
    protected _additionalDataSchema: ZodType<A> = object({
        type: string()
    })
    constructor () {
        super()
        this._name = 'commandschange'
        this._objectsPerPage = COMMANDS_PER_PAGE
    }

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<CommandDescription[]> {
        const {
            data
        } = options

        const {
            type
        } = data

        return CommandDescriptionUtils.getVisibleByType(type)
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<CommandDescription, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            data
        } = options

        const {
            type
        } = data
        const title = CommandDescriptionUtils.getTitleByType(type)

        return {
            keyboard: {

            },
            message: {
                path: 'text/actions/commands/commands.pug',
                changeValues: {
                    title,
                    commands: slicedObjects
                }
            }
        }
    }
}