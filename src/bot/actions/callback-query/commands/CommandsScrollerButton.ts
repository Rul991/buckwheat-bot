import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { CommandsScrollerDataSchema, CommandType, type CommandsScrollerData } from "../../../../protos/commands_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import CommandDescriptionUtils from "../../../../utils/command/CommandDescriptionUtils"
import type { CommandDescription } from "../../../../types/command"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import SettingUtils from "../../../../utils/settings/SettingUtils"
import { SettingValueTypes } from "../../../../protos/settings_pb"
import SettingValueService from "../../../../db/services/settings/SettingValueService"

class CommandsScrollerButton extends ScrollerButton<CommandDescription, CommandsScrollerData> {
    protected override _objectsPerPage: number = 4
    protected override _isNeedCache: boolean = false

    override settingId: number = 23
    override schema: GenMessage<CommandsScrollerData> = CommandsScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override name: string = 'cmd'

    protected override async _getRawObjects(options: CallbackQueryActionOptions<CommandsScrollerData>): Promise<CommandDescription[]> {
        const {
            data
        } = options

        const type = data.type
        return CommandDescriptionUtils.getArray(type)
    }

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<CommandDescription, CommandsScrollerData>): Promise<CommandsScrollerData> {
        return {
            $typeName: 'CommandsScrollerData',
            type: options.data.type
        }
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<CommandDescription, CommandsScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            ctx,
            slicedObjects,
            data: {
                type
            },
            chatId
        } = options

        const commands = await Promise.all(
            slicedObjects
                .map(async v => {
                    const setting = SettingUtils.get(
                        SettingValueTypes.Command,
                        v.settingId
                    )
                    const rank = await SettingValueService.get({
                        setting,
                        id: chatId
                    })
                    return {
                        ...CommandDescriptionUtils.getRendered(ctx, v),
                        rank: await RankUtils.getVars(ctx, chatId, +(rank?.value ?? setting.default))
                    }
                })
        )

        return {
            key: 'commands/command/list',
            vars: {
                commands,
                title: ctx.t('commands/types/types', { type }),
                showBotName: type != CommandType.Dice
            }
        }
    }
}

export default new CommandsScrollerButton()