import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import TopsButtonScrollerButton from "../actions/callback-query/top/TopsButtonScrollerButton"

export const startTopKeyboard = KeyboardCreator.create<{
    id?: number
}>(
    async ({
        ctx,
        data: {
            id
        },
        keyboard
    }) => {
        const bigId = id !== undefined ? BigInt(id) : undefined
        
        keyboard.add(TopsButtonScrollerButton.button({
            ctx,
            data: {
                data: {
                    $typeName: 'ScrollerData',
                    id: bigId,
                    data: {
                        case: 'update',
                        value: false
                    }
                }
            },
            key: 'button/show'
        }))
    }
)