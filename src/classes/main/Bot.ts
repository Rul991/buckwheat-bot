import { Context, Telegraf } from 'telegraf'
import BuckwheatCommand from '../commands/base/BuckwheatCommand'
import { CommandStrings } from '../../utils/types'
import ConditionalCommand from '../commands/base/ConditionalCommand'
import WrongCommand from '../commands/buckwheat/WrongCommand'
import TelegramCommand from '../commands/base/TelegramCommand'
import { BotCommand } from 'telegraf/types'
import StringUtils from '../../utils/StringUtils'
import BaseDice from '../dice/BaseDice'
import WrongDice from '../dice/WrongDice'
import EveryMessageAction from '../actions/every/EveryMessageAction'
import CallbackButtonAction from '../callback-button/CallbackButtonAction'
import Logging from '../../utils/Logging'

export default class Bot {
    private static _names = ['баквит', 'гречка']
    private static _wrongCommand = new WrongCommand()
    private static _wrongDice = new WrongDice()

    private _bot: Telegraf

    private _diceActions: Record<string, BaseDice>
    private _buckwheatCommands: Record<string, BuckwheatCommand>
    private _callbackButtonActions: Record<string, CallbackButtonAction>

    private _conditionalCommands: ConditionalCommand[]
    private _everyMessageActions: EveryMessageAction[]
    private _botCommands: BotCommand[]

    constructor(token: string) {
        this._bot = new Telegraf(token)

        this._diceActions = {}
        this._buckwheatCommands = {}
        this._callbackButtonActions = {}

        this._conditionalCommands = []
        this._everyMessageActions = []
        this._botCommands = []
    }

    private _setBotCommands(): void {
        this._bot.telegram.setMyCommands(this._botCommands)
    }

    private _onCallbackButtonAction(): void {
        this._bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const [_, name, data] = ctx.match
            Logging.log('button:', name, data)

            if(!name) return

            const action = this._callbackButtonActions[name]
            if(!action) return

            await action.execute(ctx, data ?? '')
        })
    }

    private _onEveryMessage(): void {
        this._bot.on('message', async (ctx, next) => {
            Logging.log(ctx.message)

            for (const action of this._everyMessageActions) {
                if(await action.execute(ctx)) return
            }

            next()
        })
    }

    private _onDice(): void {
        this._bot.on('dice', async ctx => {
            const {emoji, value} = ctx.message.dice
            let action = this._diceActions[emoji]

            if(!action) {
                action = Bot._wrongDice
            }

            await action.execute(ctx, value)
        })
    }

    private _onText(): void {
        this._bot.on('text', async ctx => {
            let isCommand = false

            const splittedText = StringUtils.splitBySpace(ctx.text)

            const [firstWord, command, ...other] = splittedText
            const lowerFirstWord = firstWord.toLowerCase()

            for (const name of Bot._names) {
                if(lowerFirstWord.startsWith(name)) {
                    isCommand = true
                    break
                }
            }

            if(isCommand) {
                await this._onBuckwheatCommand(ctx, [firstWord, command, other.join(' ')])
            }
        })
    }

    private async _onBuckwheatCommand(ctx: Context, [firstWord, command, other]: CommandStrings): Promise<void> {
        const message: CommandStrings = [firstWord, command, other]
        let isConditionalCommandExecuted = false

        for await (const command of this._conditionalCommands) {
            if(await command.executeIfCondition(ctx, message)) {
                isConditionalCommandExecuted = true
                break
            }
        }
        
        if(!isConditionalCommandExecuted && command) {
            const choosedCommand = this._buckwheatCommands[command.toLowerCase()]

            if(!choosedCommand) {
                Bot._wrongCommand.execute(ctx, other)
            }
            else {
                choosedCommand.execute(ctx, other)
            }
        }
    }

    private _addTelegramCommand(command: TelegramCommand): void {
        this._botCommands.push(command.botCommand)
        this._bot.command(command.name, async ctx => {
            const [_, ...other] = StringUtils.splitBySpace(ctx.text)
            await command.execute(ctx, other.join(' '))
        })
    }

    private _addBuckwheatCommand(command: BuckwheatCommand): void {
        this._buckwheatCommands[command.name] = command
    }

    private _addConditionalCommand(command: ConditionalCommand): void {
        this._conditionalCommands.push(command)
    }

    addCallbackButtonAction(...actions: CallbackButtonAction[]): void {
        actions.forEach(action => {
            this._callbackButtonActions[action.name] = action
        })
    }

    addCommands(...commands: BuckwheatCommand[]): void {
        commands.forEach(command => {
            if(command instanceof ConditionalCommand) {
                this._addConditionalCommand(command)
            }
            else if(command instanceof TelegramCommand) {
                this._addTelegramCommand(command)
            }
            else if(command instanceof BuckwheatCommand) {
                this._addBuckwheatCommand(command)
            }
            else Logging.warn('its not command', command)
        })
    }

    addDiceActions(...actions: BaseDice[]): void {
        actions.forEach(action => {
            this._diceActions[action.name] = action
        })
    }

    addEveryMessageActions(...actions: EveryMessageAction[]): void {
        this._everyMessageActions.push(...actions)
    }

    launch(): void {
        this._onEveryMessage()
        this._onDice()
        this._onText()
        this._onCallbackButtonAction()

        this._setBotCommands()
        this._bot.launch(() => {
            console.log(`Listened at https://t.me/${this._bot.botInfo?.username} (!)`)
        })
    }

    stop(reason?: string) {
        this._bot.stop(reason)
    }
}