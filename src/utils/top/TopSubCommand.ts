import type { BotContext } from "../../types/bot"
import type { TopValues, HandleSortedValuesOptions } from "../../types/top"

type ConstructorOptions =
    & Pick<TopSubCommand, 'key' | 'getUnsortedValuesCallback'>
    & Partial<Pick<TopSubCommand, 'type' | 'hasTotalCount' | 'hasWinner' | 'handleSortedValuesCallback'>>

export default class TopSubCommand {
    key: string
    type: 'role' | 'top'
    hasTotalCount: boolean
    hasWinner: boolean

    getUnsortedValuesCallback: TopSubCommand['_getUnsortedValues']
    handleSortedValuesCallback: TopSubCommand['_handleSortedValues']

    constructor({
        key,
        type = 'top',
        hasTotalCount = true,
        hasWinner = hasTotalCount,
        getUnsortedValuesCallback,
        handleSortedValuesCallback
    }: ConstructorOptions) {
        this.key = key
        this.type = type

        this.hasTotalCount = hasTotalCount
        this.hasWinner = hasWinner

        this.getUnsortedValuesCallback = getUnsortedValuesCallback
        this.handleSortedValuesCallback = handleSortedValuesCallback ?? (async ({ values }) => values)
    }

    private async _getUnsortedValues(ctx: BotContext, chatId: number): Promise<TopValues[]> {
        return this.getUnsortedValuesCallback(ctx, chatId)
    }

    private async _handleSortedValues(values: HandleSortedValuesOptions): Promise<TopValues[]> {
        return this.handleSortedValuesCallback(values)
    }

    async get(ctx: BotContext, chatId: number): Promise<TopValues[]> {
        const unsortedValues = await this._getUnsortedValues(ctx, chatId)
        const sortedValues = unsortedValues.sort(
            ({ value: a }, { value: b }) => {
                if (typeof b == 'string' && typeof a == 'string') {
                    return b.localeCompare(a)
                }
                else {
                    return (b as number) - (a as number)
                }
            }
        )

        const handledSortedValues = await this._handleSortedValues({
            chatId,
            ctx,
            values: sortedValues
        })

        return handledSortedValues
    }

    heading(ctx: BotContext): string {
        return ctx.t(`top/heading/${this.key}`)
    }

    title(ctx: BotContext): string {
        return ctx.t(`top/title/${this.key}`)
    }

    emoji(ctx: BotContext): string {
        return ctx.t(`top/emoji/${this.key}`)
    }
}