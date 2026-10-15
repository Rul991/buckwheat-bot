import { generatorKeyboard } from "../../bot/keyboards/generator"
import { GENERATOR_INCOME_PER_LEVEL, LEVEL_PER_GENERATOR } from "../../consts/generator"
import { MILLISECONDS_IN_HOUR } from "../../consts/time"
import type Generator from "../../db/entities/generator/Generator"
import GeneratorService from "../../db/services/generator/GeneratorService"
import type { BotContext } from "../../types/bot"
import TimeUtils from "../time/TimeUtils"

export default class GeneratorUtils {
    static getIncomePerHour(generator: Generator, maxLevel: number): number {
        const levels = Math.min(generator.levels, maxLevel)
        return levels * GENERATOR_INCOME_PER_LEVEL
    }

    static getIncome(generator: Generator, maxLevel: number): number {
        const incomePerHour = this.getIncomePerHour(generator, maxLevel)
        const elapsedTime = TimeUtils.getElapsed(+generator.updatedAt)
        const hours = elapsedTime / MILLISECONDS_IN_HOUR

        return Math.floor(incomePerHour * hours)
    }

    static getMaxLevel(maxGeneratorsCount: number): number {
        return maxGeneratorsCount * LEVEL_PER_GENERATOR
    }

    static async show(ctx: BotContext) {
        const id = ctx.vars.id
        const chatId = ctx.vars.chatId!

        const generator = await GeneratorService.get(chatId, id)
        const maxGeneratorsCount = await GeneratorService.getMaxGeneratorsCount(chatId, id)
        const maxLevel = this.getMaxLevel(maxGeneratorsCount)
        const user = await ctx.vars.user.get()

        const income = {
            total: this.getIncome(generator, maxLevel),
            perHour: this.getIncomePerHour(generator, maxLevel)
        }

        return {
            key: 'generator/message/show',
            options: {
                vars: {
                    income,
                    user,
                    generator,
                    maxGeneratorsCount,
                    maxLevel
                },
                keyboard: await generatorKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        } as const
    }
}