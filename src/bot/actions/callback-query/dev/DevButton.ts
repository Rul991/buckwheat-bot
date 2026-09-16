import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { DevSchema, type Dev } from "../../../../protos/dev_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { devKeyboard } from "../../../keyboards/dev"
import type { SettingValueTypes } from "../../../../protos/settings_pb"
import type Setting from "../../../../utils/settings/Setting"

class DevButton extends CallbackQueryAction<Dev> {
    override settingId: number = 22
    override name: string = 'dev'
    override schema: GenMessage<Dev> = DevSchema
    override defaultTextKey: string = 'dev/button'
    override minimumRank: number = 5
    
    override get rankSettings(): Setting<"enum", SettingValueTypes>[] {
        return []
    }

    protected override async _execute(options: CallbackQueryActionOptions<Dev>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data
        } = options

        const {
            id,
        } = data

        await MessageUtils.reply(
            ctx,
            'dev/message',
            {
                vars: {
                    data
                },
                keyboard: await devKeyboard(
                    ctx,
                    {
                        ...data,
                        id: id + 1
                    }
                )
            }
        )
    }
}

export default new DevButton