import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from './BuckwheatCommand'
import FileUtils from '../../../utils/FileUtils'
import SimpleCommand from '../../../interfaces/other/SimpleComand'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'

export default class SimpleBuckwheatCommand extends BuckwheatCommand {
    static async loadFromJsonResource(path: string): Promise<SimpleBuckwheatCommand> {
        let json = await FileUtils.readJsonFromResource<SimpleCommand>(path)
        let isWrong = false

        if(!json) {
            isWrong = true
        }
        else if(!(typeof json.name == 'string' && (typeof json.src == 'string' || typeof json.text == 'string'))) {
            isWrong = true
        }

        if(isWrong)
            return new SimpleBuckwheatCommand({name: 'ошибки', text: 'Имеются'})
        else
            return new SimpleBuckwheatCommand(json!)
    }

    private _src?: string
    private _text?: string

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(typeof this._src == 'string') {
            await MessageUtils.answerMessageFromResource(ctx, this._src)
        }
        else if(typeof this._text == 'string') {
            await MessageUtils.answer(ctx, this._text)
        }
    }

    constructor({name, src, text}: SimpleCommand) {
        super()
        this._name = name
        this._src = src
        this._text = text
    }
}