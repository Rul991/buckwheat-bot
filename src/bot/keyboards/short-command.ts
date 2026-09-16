import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
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