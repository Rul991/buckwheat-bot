import type { GrullyI18nFlavor } from "@grully/i18n"
import type { Bot, Context } from "grammy"
import type User from "../db/entities/user/User"
import type { ChatMember } from "grammy/types"
import type Balance from "../db/entities/money/Balance"
import type { ConversationFlavor } from "@grammyjs/conversations"
import type Level from "../db/entities/level/Level"
import type Chat from "../db/entities/chat/Chat"
import type Roleplay from "../db/entities/rp/Roleplay"
import type Duelist from "../db/entities/duel/Duelist"
import type ShortCommand from "../db/entities/short/ShortCommand"
import type { CommandStrings } from "./command"

export type BotContext =
    & Context
    & GrullyI18nFlavor
    & ConversationFlavor<Context>
    & {
        vars: {
            chatId?: number
            id?: number
            user?: User
            isOwner: boolean
            chatMember?: ChatMember
            balance?: Balance
            level?: Level
            chat?: Chat
            roleplay?: Roleplay
            duelist?: Duelist
            shortCommand?: ShortCommand
            commandStrings?: CommandStrings
        }
    }

export type MyBot = Bot<BotContext>