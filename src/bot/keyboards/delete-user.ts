import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import DeleteUserScrollerButton from "../actions/callback-query/delete-user/DeleteUserScrollerButton"

export const startDeleteUserKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        keyboard.add(
            DeleteUserScrollerButton.button({
                ctx,
                key: 'button/show',
                data: {
                    data: {
                        id,
                        data: {
                            case: 'update',
                            value: false
                        },
                        $typeName: 'ScrollerData',
                    }
                }
            })
        )
    }
)