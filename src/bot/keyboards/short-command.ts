import type ShortCommand from "../../db/entities/short/ShortCommand"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ShortCommandDeleteButton from "../actions/callback-query/short-command/ShortCommandDeleteButton"
import ShortCommandScrollerButton from "../actions/callback-query/short-command/ShortCommandScrollerButton"

export const startShortCommandKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data: {
            id
        },
        keyboard
    }) => {
        keyboard.add(ShortCommandScrollerButton.button({
            ctx,
            data: {
                data: {
                    data: {
                        case: 'update',
                        value: false
                    },
                    id: BigInt(id),
                    $typeName: 'ScrollerData'
                }
            },
            key: 'button/show'
        }))
    }
)

export const showShortCommandKeyboard = KeyboardCreator.create<{
    shortCommand: ShortCommand
    id: number
    page: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const { shortCommand, page } = data

        keyboard
            .copyText(
                ctx.t('shorten/copy/text'),
                ctx.t(
                    'shorten/copy/value',
                    {
                        shortCommand
                    }
                )
            )
            .style('primary')

        keyboard
            .add(ShortCommandDeleteButton.button({
                ctx,
                data: {
                    command: shortCommand._id!.id,
                    id
                },
                style: 'danger'
            }))
            .add(
                ShortCommandScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id,
                            $typeName: 'ScrollerData',
                            data: {
                                case: 'page',
                                value: page
                            }
                        }
                    },
                    key: 'button/back'
                })
            )

        return keyboard.toFlowed(1)
    }
)