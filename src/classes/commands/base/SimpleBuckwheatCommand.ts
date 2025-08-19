import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from './BuckwheatCommand'
import FileUtils from '../../../utils/FileUtils'
import SimpleCommand from '../../../interfaces/other/SimpleComand'
import MessageUtils from '../../../utils/MessageUtils'

export default class SimpleBuckwheatCommand extends BuckwheatCommand {
    static async loadFromJsonResource(path: string): Promise<SimpleBuckwheatCommand> {
        let json = await FileUtils.readJsonFromResource<SimpleCommand>(path)
        let isWrong = false

        if(!json) {
            isWrong = true
        }
        else {
            isWrong = !(
                typeof json.name == 'string' && 
                (typeof json.src == 'string' || typeof json.text == 'string') &&
                (typeof json.avoidOther === 'boolean' || typeof json.avoidOther == 'undefined')
            )
        }

        if(isWrong)
            return new this({name: 'ошибки', text: 'Имеются'})
        else
            return new this(json!)
    }

    protected _src?: string
    protected _text?: string
    protected _avoidOther?: boolean

    protected async _sendMessageBySrc(ctx: TextContext, src: string) {
        await MessageUtils.answerMessageFromResource(ctx, src)
    }

    protected async _sendMessageByText(ctx: TextContext, text: string) {
        await MessageUtils.answer(ctx, text)
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other && this._avoidOther) {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/other/wrong-command.pug')
            return
        }

        if(typeof this._src == 'string') {
            this._sendMessageBySrc(ctx, this._src)
        }
        else if(typeof this._text == 'string') {
            this._sendMessageByText(ctx, this._text)
        }
    }

    constructor({name, src, text, avoidOther}: SimpleCommand) {
        super()

        this._name = name
        this._src = src
        this._text = text
        this._avoidOther = avoidOther

        this._isShow = false
    }
}