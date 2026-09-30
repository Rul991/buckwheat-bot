import type { BotContext } from "../../../../types/bot"
import MathUtils from "../../../../utils/math/MathUtils"
import StringUtils from "../../../../utils/string/StringUtils"
import SetSettingConversation from "./SetSettingConversation"

class SetNumberSettingConversation extends SetSettingConversation<number> {
    override name: string = 'set-setting-number'

    protected override _handleRawValue(raw: string): number {
        return StringUtils.getNumberFromString(raw)
    }

    protected override _clampValue(value: number, min: number, max: number): number | undefined {
        return MathUtils.clamp(
            value,
            min,
            max
        )
    }

    protected override _getShowClampedValue(_ctx: BotContext, value: number): string | number {
        return value
    }
}

export default new SetNumberSettingConversation()