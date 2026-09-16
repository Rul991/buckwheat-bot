import type { BotContext } from "../../../types/bot"
import type { CommandStrings } from "../../../types/command"
import SettingUtils from "../../../utils/settings/SettingUtils"
import type RankedAction from "../../actions/base/RankedAction"
import BaseHandler from "./BaseHandler"

type CheckRankOptions<A extends RankedAction> = {
    ctx: BotContext
    commandStrings?: CommandStrings
    action: A
}

export default abstract class RankedHandler<A extends RankedAction> extends BaseHandler<A> {
    override add(...actions: A[]): this {
        for (const action of actions) {
            SettingUtils.add(
                action.settingValueType,
                ...action.rankSettings
            )
        }
        return super.add(...actions)
    }

    protected async _checkRank({
        action,
        ctx,
        commandStrings = ['', action.name, undefined]
    }: CheckRankOptions<A>): Promise<boolean> {
        const [hasRank, needRank] = await action.checkRank(ctx)

        if (!hasRank) {
            await action.sendLowRankMessage(ctx, commandStrings, needRank)
        }

        return hasRank
    }
}