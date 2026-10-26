import { env } from "bun"
import type { DevMode } from "../types/unions"
import { coerce, literal, object, string, url } from 'zod'
import { NUMBER_COLON_STRING_REGEX } from "./regex"

const specialIdSchema = string()
    .regex(NUMBER_COLON_STRING_REGEX)
    .transform((s): [number, string] => {
        const idx = s.indexOf(":")
        return [Number(s.slice(0, idx)), s.slice(idx + 1)]
    })

const envSchema = object({
    BOT_TOKEN: string(),
    DB_URL: url(),
    DEV_MODE: literal(['prod', 'dev']).default('dev'),
    DEV_ID: coerce.number().int(),
    CHAT_ID: coerce.number().int(),
    BASE_URL: url().optional(),
    START_MESSAGE: string().max(2048).default('Good morning, I’m awake!'),
    SPECIAL_IDS: string()
        .transform(s => s.trim() === "" ? [] : s.split(","))
        .pipe(specialIdSchema.array()),
})

const envData = envSchema.parse(env)

export const BOT_TOKEN: string = envData.BOT_TOKEN
export const DB_URL: string = envData.DB_URL
export const START_MESSAGE: string = envData.START_MESSAGE

export const MODE: DevMode = envData.DEV_MODE
export const IS_DEV: boolean = MODE == 'dev'
export const IS_PROD: boolean = !IS_DEV

export const DEV_ID: number = envData.DEV_ID
export const SPECIAL_IDS = envData.SPECIAL_IDS

export const CHAT_ID: number = envData.CHAT_ID
export const BASE_URL: string | undefined = envData.BASE_URL