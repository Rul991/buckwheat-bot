import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SettingBackButtonData, SettingBackButtonDataSchema } from "../../../../protos/settings_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { settingStartKeyboard } from "../../../keyboards/settings"

class SettingBackButton extends CallbackQueryAction<SettingBackButtonData> {
    override schema: GenMessage<SettingBackButtonData> = SettingBackButtonDataSchema
    override defaultTextKey: string = 'button/back'
    override minimumRank: number = RankUtils.min
    override settingId: number = 94
    override name: string = 'setback'

    protected override async _getId(options: CallbackQueryActionOptions<SettingBackButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SettingBackButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        await MessageUtils.editText(
            ctx,
            'setting/start',
            {
                keyboard: await settingStartKeyboard(
                    ctx,
                    {}
                )
            }
        )
    }
}

export default new SettingBackButton()