import type { BotContext } from "../../../../types/bot"
import SetSettingConversation from "./SetSettingConversation"

class SetStringSettingConversation extends SetSettingConversation<string> {
    override name: string = 'set-setting-string'

    protected override _handleRawValue(raw: string): string {
        return raw
    }

    protected override _clampValue(value: string, min: number, max: number): string | undefined {
        if(value.length < min) return undefined
        return value.slice(0, max)
    }

    protected override _getShowClampedValue(_ctx: BotContext, value: string): string {
        return value
    }
}

export default new SetStringSettingConversation()