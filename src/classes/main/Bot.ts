import { Telegraf } from 'telegraf'
import BuckwheatCommand from '../commands/base/BuckwheatCommand'
import TelegramCommand from '../commands/base/TelegramCommand'
import BaseDice from '../dice/BaseDice'
import EveryMessageAction from '../actions/every/EveryMessageAction'
import CallbackButtonAction from '../callback-button/CallbackButtonAction'
import Logging from '../../utils/Logging'
import { CHAT_ID, MODE } from '../../utils/consts'
import FileUtils from '../../utils/FileUtils'
import BaseHandler from './handlers/BaseHandler'
import TelegramCommandHandler from './handlers/commands/TelegramCommandHandler'
import CommandHandler from './handlers/commands/CommandHandler'
import EveryMessageHandler from './handlers/EveryMessageHandler'
import CallbackButtonActionHandler from './handlers/CallbackButtonActionHandler'
import DiceHandler from './handlers/DiceHandler'
import NewMemberHandler from './handlers/NewMemberHandler'
import NewMemberAction from '../actions/new-member/NewMemberAction'
import PhotoHandler from './handlers/PhotoHandler'
import PhotoAction from '../actions/photo/PhotoAction'

export default class Bot {    
    private _bot: Telegraf
    private _handlers: BaseHandler<any, any>[]

    private _telegramCommandHandler: TelegramCommandHandler
    private _commandHandler: CommandHandler
    private _everyMessageHandler: EveryMessageHandler
    private _callbackButtonHandler: CallbackButtonActionHandler
    private _diceHandler: DiceHandler
    private _newMemberHandler: NewMemberHandler
    private _photoHandler: PhotoHandler

    constructor(token: string) {
        this._bot = new Telegraf(token)

        this._everyMessageHandler = new EveryMessageHandler
        this._telegramCommandHandler = new TelegramCommandHandler
        this._commandHandler = new CommandHandler
        this._callbackButtonHandler = new CallbackButtonActionHandler
        this._diceHandler = new DiceHandler
        this._newMemberHandler = new NewMemberHandler
        this._photoHandler = new PhotoHandler()

        this._handlers = [
            this._everyMessageHandler,
            this._telegramCommandHandler,
            this._commandHandler,
            this._callbackButtonHandler,
            this._diceHandler,
            this._newMemberHandler,
            this._photoHandler
        ]
    }

    private _addTelegramCommand(command: TelegramCommand): void {
        this._telegramCommandHandler.add(command)
    }

    private _addCommand(command: BuckwheatCommand): void {
        this._commandHandler.add(command)
    }

    addPhotoActions(...actions: PhotoAction[]): void {
        this._photoHandler.add(...actions)
    }

    addNewMemberAction(...actions: NewMemberAction[]): void {
        this._newMemberHandler.add(...actions)
    }

    addCallbackButtonAction(...actions: CallbackButtonAction[]): void {
        this._callbackButtonHandler.add(...actions)
    }

    addCommands(...commands: BuckwheatCommand[]): void {
        commands.forEach(command => {
            if(command instanceof TelegramCommand) {
                this._addTelegramCommand(command)
            }
            else if(command instanceof BuckwheatCommand) {
                this._addCommand(command)
            }
            else Logging.warn('its not command', command)
        })
    }

    addDiceActions(...actions: BaseDice[]): void {
        this._diceHandler.add(...actions)
    }

    addEveryMessageActions(...actions: EveryMessageAction[]): void {
        this._everyMessageHandler.add(...actions)
    }

    launch(): void {
        this._handlers.forEach(handler => 
            handler.setup(this._bot)
        )

        try {
            this._bot.launch(async () => {
                console.log(`Listened at https://t.me/${this._bot.botInfo?.username} (!)`)
                if(MODE == 'prod') {
                    this._bot.telegram.sendMessage(
                        CHAT_ID, 
                        await FileUtils.readTextFromResource('text/commands/update/after_restart.html')
                    )
                }
            })
        }
        catch(e) {
            Logging.error(e)
        }
    }

    stop(reason?: string) {
        this._bot.stop(reason)
    }
}