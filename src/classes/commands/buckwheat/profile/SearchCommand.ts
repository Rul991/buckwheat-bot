import User from '../../../../interfaces/schemas/user/User'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import SearchUtils from '../../../../utils/SearchUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import { Link } from '../../../../utils/values/types/types'
import UserProfileService from '../../../db/services/user/UserProfileService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

type SearchObject = {
    prefix: string
    execute: (options: BuckwheatCommandOptions & { data: string }) => Promise<User[]>
    text: string
}

export default class extends BuckwheatCommand {
    protected _settingId: string = 'search'
    private readonly _prefixSeparator = ':'

    private _noPrefixSearchObject: SearchObject = {
        execute: async options => {
            const {
                chatId,
                data
            } = options

            const lowerData = data.toLowerCase()
            const users = await UserProfileService.getAll(chatId)

            return users.filter(({ name }) => {
                const lowerName = name.toLowerCase()
                return lowerName.includes(lowerData)
            })
        },
        text: 'именем, которое содержит:',
        prefix: ''
    }



    constructor () {
        super()
        this._name = 'поиск'
        this._aliases = [
            'найти'
        ]
        this._description = 'нахожу игроков по заданным параметрам в чате\nнаписание без аргументов отображает как работать с этой командой'
        this._needData = true
        this._minimumRank = 1
    }



    async execute(options: BuckwheatCommandOptions): Promise<void> {
        const {
            ctx,
            other,
            id
        } = options

        if (!other) {
            await SearchUtils.sendHelpMessage(ctx)
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/search/done.pug',
            {
                changeValues: {
                    other
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'search/start',
                    {
                        globals: {
                            id,
                            other
                        }
                    }
                )
            }
        )

    }
}