import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import { COMMANDS_PER_PAGE } from '../../../../utils/values/consts'
import { CommandDescription } from '../../../../utils/values/types/types'
import ScrollerAction from '../new/ScrollerAction'
import { object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../../utils/values/types/scrollers'
import CommandAccessService from '../../../db/services/settings/access/CommandAccessService'
import RankUtils from '../../../../utils/RankUtils'
import RankSettingsService from '../../../db/services/settings/RankSettingsService'

type T = CommandDescription & {
    rank: {
        value: number
        emoji: string
    }
}
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

    protected async _getRawObjects(options: CallbackButtonOptions<NewScrollerData<A>>): Promise<T[]> {
        const {
            data,
            chatId
        } = options

        const {
            type
        } = data

        const visible = CommandDescriptionUtils.getVisibleByType(type)
        const ranks = await CommandAccessService.getObject(chatId)
        const rankNames = await RankSettingsService.getObject(chatId)

        return visible.map(command => {
            const rank = ranks[command.settingId] ?? RankUtils.unknown
            return {
                ...command,
                rank: {
                    value: rank,
                    emoji: RankUtils.getEmojiByRank(rank),
                    title: rankNames[`rank-${rank}`]
                }
            }
        })
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<T, A>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            data
        } = options

        const {
            type
        } = data
        const title = CommandDescriptionUtils.getTitleByType(type)

        return {
            keyboard: {},
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