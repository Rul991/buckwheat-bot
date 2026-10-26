import SettingValueService from "../../../../db/services/settings/SettingValueService"
import { notifySelectClassSetting } from "../../../../resources/settings/chat"
import type { ConditionalCommandOptions } from "../../../../types/action-options"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ClassUtils from "../../../../utils/db/ClassUtils"
import { classesKeyboard } from "../../../keyboards/user"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class NoClassConditionalCommand extends ConditionalCommand {
    override async condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            chatId,
            ctx
        } = options

        const isNotify = await SettingValueService.getValue({
            id: chatId,
            setting: notifySelectClassSetting
        })
        if(!isNotify) return false

        const user = await ctx.vars.user.get()
        return user?.className == ClassUtils.defaultClassName
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            ctx,
            id
        } = options

        await MessageUtils.reply(
            ctx,
            'classes/change',
            {
                keyboard: await classesKeyboard(
                    ctx,
                    id
                )
            }
        )
    }

}