import type { AnyParamConstructor } from "@typegoose/typegoose/lib/types"
import type BaseEntity from "../db/entities/base/BaseEntity"
import type { ReactionTypeEmoji } from "grammy/types"

export type RepoExtends = BaseEntity & AnyParamConstructor<any>
export type DevMode = 'prod' | 'dev'
export type Dices = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'

export type MaybeString = string | undefined
export type Reactions = ReactionTypeEmoji['emoji']
export type ChatTypes = 'private' | 'chat'

export type RankVars = {
    value: number
    name: string
    emoji: string
}

export type DefaultVars = {
    title: string
    description: string
    emoji: string
}

export type ExportImportDefinitionVars = DefaultVars

export type MessagesType = 'total' | 'day' | 'month' | 'year'
export type AvaHistoryType = 'image' | 'video' | 'animation'
export type StartUp<T = number> = {
    start: T
    up: T
}