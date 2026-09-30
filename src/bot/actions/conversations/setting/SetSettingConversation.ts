import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import SettingUtils from "../../../../utils/settings/SettingUtils"
import type { SettingValueTypes } from "../../../../protos/settings_pb"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import SettingValueService from "../../../../db/services/settings/SettingValueService"

type Data = {
    settingId: number
    settingOwnerId: number
    valueType: SettingValueTypes
}

export default abstract class SetSettingConversation<T extends string | number> extends ConversationAction<[Data]> {
    protected abstract _handleRawValue(raw: string): T
    protected abstract _clampValue(value: T, min: number, max: number): T | undefined
    protected abstract _getShowClampedValue(ctx: BotContext, value: T): T | string

    protected override async _execute(
        conversation: Conversation<BotContext, Context>,
        ctx: Context,
        data: Data
    ): Promise<void> {
        const id = ctx.from!.id
        const {
            settingId,
            settingOwnerId,
            valueType
        } = data

        const setting = SettingUtils.get(
            valueType,
            settingId
        )
        const { min, max } = 'min' in setting.properties ? setting.properties : { min: -1, max: -1 }

        const checkpoint = conversation.checkpoint()
        await ConversationUtils.replyInConversation(
            conversation,
            'setting/conversation/enter',
            ctx => ({
                vars: {
                    setting: {
                        ...setting,
                        ...setting.getVars(ctx)
                    },
                    min: setting.getShowableValue(ctx, min),
                    max: setting.getShowableValue(ctx, max),
                }
            })
        )

        const textCtx = await conversation.waitFor(
            'message:text'
        ).andFrom(id)

        const raw = textCtx.msg.text
        const value = this._handleRawValue(raw)
        const clampedValue = this._clampValue(value, min, max)
        if (clampedValue === undefined) {
            await conversation.rewind(checkpoint)
            return
        }

        await SettingValueService.set({
            id: settingOwnerId,
            setting,
            value: clampedValue
        })

        await ConversationUtils.replyInConversation(
            conversation,
            'setting/conversation/set',
            ctx => ({
                vars: {
                    setting: setting.getVars(ctx),
                    value: this._getShowClampedValue(ctx, clampedValue)
                }
            })
        )
    }
}