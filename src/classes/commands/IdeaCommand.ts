import MessageUtils from '../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../utils/types'
import IdeasService from '../db/services/ideas/IdeasService'
import BuckwheatCommand from './base/BuckwheatCommand'

export default class IdeaCommand extends BuckwheatCommand {
    constructor() {
        super()

        this._name = 'идеи'
        this._description = 'добавляю твою идею в общий список'

        this._needData = true
        this._argumentText = 'идея'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/ideas/start.pug',
                {
                    inlineKeyboard: ['start_ideas', '@'],
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