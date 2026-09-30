import type { BotContext } from "../../../../types/bot"
import MathUtils from "../../../../utils/math/MathUtils"
import TimeUtils from "../../../../utils/time/TimeUtils"
import SetSettingConversation from "./SetSettingConversation"

class SetDateSettingConversation extends SetSettingConversation<number> {
    override name: string = 'set-setting-date'
    protected override _handleRawValue(raw: string): number {
        return TimeUtils.parseTimeToMilliseconds(raw)
    }

    protected override _clampValue(value: number, min: number, max: number): number | undefined {
        return MathUtils.clamp(
            value,
            min,
            max
        )
    }
    protected override _getShowClampedValue(ctx: BotContext, value: number): string | number {
        return TimeUtils.formatMillisecondsToTime(
            ctx,
            value
        )
    }
}

export default new SetDateSettingConversation()