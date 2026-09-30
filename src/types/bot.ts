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
import type { LazyCacheRecord } from "./types"

export type BotContext<T = Record<string, any>> =
    & Context
    & GrullyI18nFlavor
    & ConversationFlavor<Context>
    & {
        vars:
        & {
            chatId?: number
            id: number
            commandStrings: CommandStrings | undefined
            roleplay: Roleplay | undefined
            shortCommand: ShortCommand | undefined
        }
        & LazyCacheRecord<{
            isOwner: boolean
            chatMember: ChatMember | undefined
            user: User | undefined
            balance: Balance | undefined
            level: Level | undefined
            chat: Chat | undefined
            duelist: Duelist | undefined
        }>
    }
    & {
        actionData: T
    }

export type MyBot =
    & Bot<BotContext>
    & {
        i18n: Omit<GrullyI18nFlavor["i18n"], "languageCode">
    }