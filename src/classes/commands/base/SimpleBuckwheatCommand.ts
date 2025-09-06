import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from './BuckwheatCommand'
import FileUtils from '../../../utils/FileUtils'
import SimpleCommand from '../../../interfaces/other/SimpleComand'
import MessageUtils from '../../../utils/MessageUtils'
import RandomUtils from '../../../utils/RandomUtils'
import ObjectValidator from '../../../utils/ObjectValidator'
import { simpleCommandSchema } from '../../../utils/values/schemas'

export default class SimpleBuckwheatCommand extends BuckwheatCommand {
    static async loadFromJsonResource(path: string): Promise<SimpleBuckwheatCommand> {
        let json = await FileUtils.readJsonFromResource<SimpleCommand>(path)
        let isWrong = false

        if(!json) {
            isWrong = true
        }
        else {
            isWrong = ObjectValidator.isValidatedObject(json, simpleCommandSchema) 
                && !(typeof json.src == 'undefined' && typeof json.src == typeof json.text)
        }

        if(isWrong)
            return new this({name: 'ошибки', text: 'Имеются'})
        else
            return new this(json!)
    }

    protected _sources?: string[]
    protected _texts?: string[]
    protected _avoidOther?: boolean

    protected _getAllText(text?: string[] | string): string[] {
        if(typeof text == 'string') 
            return [text]
        else if(typeof text == 'undefined') {
            return []
        }
        else {
            return text
        }
    }

    protected _hasLength(arr?: any[]): boolean {
        return (arr?.length ?? 0) > 0
    }

    protected _isSource(): boolean | null {
        const hasTexts = this._hasLength(this._texts)
        const hasSources = this._hasLength(this._sources)

        if(hasTexts && hasSources) {
            return RandomUtils.chance(0.5)
        }
        else if(hasSources && !hasTexts) {
            return true
        }
        else {
            return null
        }
    }

    protected async _sendMessageBySrc(ctx: TextContext, src: string) {
        await MessageUtils.answerMessageFromResource(ctx, src)
    }

    protected async _sendMessageByText(ctx: TextContext, text: string) {
        await MessageUtils.answer(ctx, text)
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(other && this._avoidOther) {
            await MessageUtils.sendWrongCommandMessage(ctx)
            return
        }

        const isSource = this._isSource()
        const text = RandomUtils.choose((isSource ? this._sources : this._texts) ?? [])

        if(!text) {
            return await MessageUtils.sendWrongCommandMessage(ctx)
        }

        if(isSource) {
            this._sendMessageBySrc(ctx, text)
        }
        else if(isSource !== null) {
            this._sendMessageByText(ctx, text)
        }
        else {
            await MessageUtils.sendWrongCommandMessage(ctx)
        }
    }

    constructor({name, src, text, avoidOther}: SimpleCommand) {
        super()

        this._name = name
        this._sources = this._getAllText(src)
        this._texts = this._getAllText(text)
        this._avoidOther = avoidOther

        this._isShow = false
    }
}