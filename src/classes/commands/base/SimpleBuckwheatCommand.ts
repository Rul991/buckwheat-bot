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
            return new SimpleBuckwheatCommand({name: 'ошибки', text: 'Имеются'})
        else
            return new SimpleBuckwheatCommand(json!)
    }

    private _src?: string
    private _text?: string
    private _avoidOther?: boolean

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other && this._avoidOther) {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/wrongCommand.html')
            return
        }

        if(typeof this._src == 'string') {
            await MessageUtils.answerMessageFromResource(ctx, this._src)
        }
        else if(typeof this._text == 'string') {
            await MessageUtils.answer(ctx, this._text)
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