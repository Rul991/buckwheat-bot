import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { TopScrollerButtonDataSchema, type TopScrollerButtonData } from "../../../../protos/top_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import type User from "../../../../db/entities/user/User"
import TopUtils from "../../../../utils/top/TopUtils"
import UserService from "../../../../db/services/user/UserService"
import { InlineKeyboard } from "grammy"
import TopsButtonScrollerButton from "./TopsButtonScrollerButton"

type O = {
    user: User
    value: string | number
}

class TopScrollerButton extends ScrollerButton<O, TopScrollerButtonData> {
    override schema: GenMessage<TopScrollerButtonData> = TopScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 77
    override name: string = 'top'
    protected override _objectsPerPage: number = 20

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<O, TopScrollerButtonData>): Promise<InlineKeyboard> {
        const {
            ctx,
            data
        } = options

        const {
            page
        } = data

        const keyboard = new InlineKeyboard()
        const id = data.data?.id

        keyboard.add(TopsButtonScrollerButton.button({
            ctx,
            data: {
                ...data,
                data: {
                    data: page !== undefined ?
                        {
                            case: 'page',
                            value: page
                        } :
                        {
                            case: 'update',
                            value: false
                        },
                    $typeName: 'ScrollerData',
                    id
                }
            },
            key: 'button/back'
        }))

        return keyboard
    }

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<O, TopScrollerButtonData>): Promise<Omit<TopScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        return {
            type: options.data.type,
            page: options.data.page
        }
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<TopScrollerButtonData>): Promise<O[]> {
        const {
            data: {
                type
            },
            ctx,
            chatId
        } = options

        const subCommand = TopUtils.getSubCommand(type)
        if (!subCommand) return []

        const values = await subCommand.get(
            ctx,
            chatId
        )

        const ids = values.map(v => v.id)
        const users = await UserService.getAllByIds(chatId, ids)

        const namedValues = values
            .map(v => {
                const {
                    id,
                    value
                } = v

                const user = users.get(id)
                if (!user) return undefined

                return {
                    user,
                    value
                }
            })
            .filter(v => v !== undefined)

        return namedValues
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<O, TopScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            data: {
                type
            },
            objects,
            id,
            slicedObjects,
            ctx,
            page
        } = options

        const subCommand = TopUtils.getSubCommand(type)
        const {
            hasTotalCount,
            hasWinner,
            type: topType
        } = subCommand

        const emoji = subCommand.emoji(ctx)
        const heading = subCommand.heading(ctx)

        const totalCount = hasTotalCount ? objects.reduce((prev, { value }) => {
            if (typeof value == 'number') {
                return prev + value
            }

            return prev
        }, 0) : 0

        const playerPlace = objects.findIndex(
            v => v.user.id == id
        ) + 1

        return {
            key: `top/list/${topType}`,
            vars: {
                emoji,
                objects: slicedObjects,
                perPage: this._objectsPerPage,
                totalCount,
                hasTotalCount,
                heading,
                hasWinner,
                playerPlace,
                page
            }
        }
    }
}

export default new TopScrollerButton()