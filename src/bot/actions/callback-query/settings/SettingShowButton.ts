import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import { SettingShowDataSchema, type SettingShowData } from "../../../../protos/settings_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import SettingUtils from "../../../../utils/settings/SettingUtils"
import SettingValueService from "../../../../db/services/settings/SettingValueService"
import SettingPresenter from "../../../../utils/settings/SettingPresenter"

type T = SettingShowData

class SettingShowButton extends CallbackQueryAction<T> {
    override schema: GenMessage<T> = SettingShowDataSchema
    override defaultTextKey: string = 'setting/show/button'
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
            chatId,
            id: userId
        } = options

        const {
            settingId,
            type,
            page
        } = data

        const isChat = SettingUtils.isChat(type)
        const settingOwnerId = Number(isChat ? chatId : userId)

        const setting = SettingUtils.get(type, settingId)
        const settingValue = await SettingValueService.get({
            id: settingOwnerId,
            setting
        })

        const {
            key,
            options: messageOptions
        } = await SettingPresenter.show({
            ctx,
            setting,
            settingValue,
            page,
            userId
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new SettingShowButton()