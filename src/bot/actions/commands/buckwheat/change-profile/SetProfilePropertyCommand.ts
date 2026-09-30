import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"

export default abstract class SetProfilePropertyCommand extends BuckwheatCommand {
    protected _isHtml = false
    protected abstract _length: number
    override isSupportReply: boolean = true
    override needData: boolean = true

    protected abstract _getProperty(options: BuckwheatCommandOptions): Promise<string>
    protected abstract _execute(options: BuckwheatCommandOptions & { text: string }): Promise<string>

    protected _getText(options: BuckwheatCommandOptions): string {
        const {
            other,
            ctx
        } = options
        if(!this._isHtml) return other!.slice(0, this._length)
        
        const message = ctx.msg
        return MessageEntityUtils
            .messageToHtml({
                ...message,
                text: message.text?.slice(0, this._length)
            })
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            other,
            replyFrom,
            commandStrings,
            replyOrUserFrom,
        } = options

        const replyOrUser = {
            ...replyOrUserFrom,
            name: replyOrUserFrom.first_name,
        }

        if (!other || (replyFrom && !replyFrom?.is_bot)) {
            const property = await this._getProperty(options)
            return {
                key: `profile/${this.filename}/property`,
                options: {
                    vars: {
                        property,
                        user: replyOrUser,
                    }
                }
            }
        }

        const text = this._getText(options)
        const user = await ctx.vars.user.get()
        const needRank = RankUtils.admin

        if (replyFrom?.is_bot && !RankUtils.has(user?.rank ?? RankUtils.min, needRank)) {
            return await this.sendLowRankMessage(ctx, commandStrings, needRank)
        }

        const result = await this._execute({
            ...options,
            text
        })
        return {
            key: `profile/${this.filename}/changed`,
            options: {
                vars: {
                    text: result,
                    user: replyOrUser
                }
            }
        }
    }
}