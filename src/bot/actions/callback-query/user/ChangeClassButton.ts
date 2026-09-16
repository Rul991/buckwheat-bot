import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { ClassDataSchema, type ClassData } from "../../../../protos/user_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import UserClassService from "../../../../db/services/user/UserClassService"
import type { ClassTypes } from "../../../../types/class"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ExperienceUtils from "../../../../utils/level/ExperienceUtils"
import DuelistService from "../../../../db/services/duel/DuelistService"

class ChangeClassButton extends CallbackQueryAction<ClassData> {
    override settingId: number = 24
    override schema: GenMessage<ClassData> = ClassDataSchema
    override defaultTextKey: string = 'classes/full-name'
    override minimumRank: number = RankUtils.min
    override name: string = 'chcl'

    protected override async _execute(options: CallbackQueryActionOptions<ClassData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
            chatId,
            id
        } = options
        const level = ExperienceUtils.getLevelFromObject(ctx.vars.level)

        const {
            type
        } = data
        const className = type as ClassTypes

        await Promise.all([
            UserClassService.set(
                chatId,
                id,
                className
            ),
            DuelistService.save({
                chatId,
                id,
                className,
                level
            }),
            MessageUtils.reply(
                ctx,
                'classes/changed',
                {
                    vars: {
                        type,
                        user: ctx.vars.user
                    }
                }
            ),
        ])
        await MessageUtils.deleteMessages(ctx)
    }
}

export default new ChangeClassButton()