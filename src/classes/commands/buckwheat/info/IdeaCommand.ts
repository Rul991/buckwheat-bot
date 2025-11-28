import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import IdeasService from '../../../db/services/ideas/IdeasService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class IdeaCommand extends BuckwheatCommand {
    constructor() {
        super()

        this._name = 'идеи'
        this._description = 'добавляю твою идею в общий список'

        this._needData = true
        this._argumentText = 'идея'
        this._aliases = [
            'идея',
        ]
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/ideas/start.pug',
                {
                    inlineKeyboard: await InlineKeyboardManager.get(
                        'start_ideas', 
                        JSON.stringify({id: ctx.from.id})
                    ),
                    changeValues: {
                        length: (await IdeasService.getIdeas()).length
                    }
                }
            )
        }
        else {
            await IdeasService.add({
                name: ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name,
                text: other
            })
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/ideas/new.pug'
            )
        }
    }
}