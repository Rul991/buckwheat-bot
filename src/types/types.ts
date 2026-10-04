import type { AnyParamConstructor } from "@typegoose/typegoose/lib/types"
import type BaseEntity from "../db/entities/base/BaseEntity"
import type { ReactionTypeEmoji } from "grammy/types"
import type LazyValue from "../utils/cache/LazyValue"

export type RepoExtends = BaseEntity & AnyParamConstructor<any>
export type MaybeString = string | undefined
export type Reactions = ReactionTypeEmoji['emoji']

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

export type StartUp<T = number> = {
    start: T
    up: T
}

export type LazyCacheRecord<O extends Record<string, any>> = {
    [K in keyof O]: LazyValue<O[K]>
}