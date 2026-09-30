import { env } from "bun"
import type { DevMode } from "../types/types"
import { coerce, literal, object, string, url } from 'zod'

const envSchema = object({
    BOT_TOKEN: string(),
    DB_URL: url(),
    DEV_MODE: literal(['prod', 'dev']).default('dev'),
    DEV_ID: coerce.number().int(),
    CHAT_ID: coerce.number().int(),
    BASE_URL: url().optional(),
    START_MESSAGE: string().max(2048).default('Good morning, I’m awake!'),
    MOMMY_ID: coerce.number().int().optional()
})

const envData = envSchema.parse(env)

export const BOT_TOKEN: string = envData.BOT_TOKEN
export const DB_URL: string = envData.DB_URL
export const START_MESSAGE: string = envData.START_MESSAGE

export const MODE: DevMode = envData.DEV_MODE
export const IS_DEV: boolean = MODE == 'dev'
export const IS_PROD: boolean = !IS_DEV

export const DEV_ID: number = envData.DEV_ID
export const MOMMY_ID: number | undefined = envData.MOMMY_ID

export const CHAT_ID: number = envData.CHAT_ID
export const BASE_URL: string | undefined = envData.BASE_URL