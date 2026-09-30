import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import LinkScrollerButton from "../actions/callback-query/link/LinkScrollerButton"

export const startLinkKeyboard = KeyboardCreator.create<{
    id?: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = data.id ? BigInt(data.id) : undefined

        keyboard.add(
            LinkScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id,
                        data: {
                            case: 'update',
                            value: false
                        }
                    }
                },
                key: 'button/show'
            })
        )
    }
)