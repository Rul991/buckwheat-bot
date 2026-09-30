import type { GrullyI18nVars } from "@grully/i18n"
import type { AnswerPreCheckoutQueryOptions, ReplyMediaOptions, ReplyOptions } from "./options"
import type AvaHistory from "../db/entities/user/AvaHistory"

export type CallbackQueryExecuteResult =
    | (
        | {
            isAlert?: false
            key?: string
        }
        | {
            isAlert: true
            key: string
        }
    ) & { vars?: GrullyI18nVars }
    | void

export type BuckwheatCommandExecuteResult =
    & {
        key: string
        options?: ReplyOptions
    }
    | void

export type ScrollerButtonEditMessageResult =
    & {
        key: string
        vars?: GrullyI18nVars
        media?: Omit<AvaHistory, 'createdAt' | '_id'>
    }

export type PhotoActionExecuteResult =
    | {
        key: string
        options?: ReplyOptions
    }
    | {
        photo: string
        options?: ReplyMediaOptions
    }
    | void

export type PreCheckoutResult = AnswerPreCheckoutQueryOptions

export type SuccessfulPaymentResult = BuckwheatCommandExecuteResult