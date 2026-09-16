import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import { SettingShowDataSchema, type SettingShowData } from "../../../../protos/settings_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { settingShowKeyboard } from "../../../keyboards/settings"
import SettingUtils from "../../../../utils/settings/SettingUtils"

type T = SettingShowData

class SettingShowButton extends CallbackQueryAction<T> {
    override schema: GenMessage<T> = SettingShowDataSchema
    override defaultTextKey: string = 'setting/show-button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 37
    override name: string = 'stshw'

    protected override async _getId(options: CallbackQueryActionOptions<SettingShowData>): Promise<number | undefined> {
        const {
            data: {
                userId
            }
        } = options

        return Number(userId)
    }

    protected override async _execute(options: CallbackQueryActionOptions<T>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
        } = options

        const {
            id: rawSettingOwnerId,
            settingId,
            type,
            userId: rawUserId
        } = data

        const settingOwnerId = Number(rawSettingOwnerId)
        const userId = Number(rawUserId)
        const setting = SettingUtils.get(type, settingId)

        await MessageUtils.editText(
            ctx,
            'setting/show-message',
            {
                vars: {

                },
                keyboard: await settingShowKeyboard(
                    ctx,
                    {
                        setting,
                        settingOwnerId,
                        userId
                    }
                )
            }
        )
    }
}

export default new SettingShowButton()