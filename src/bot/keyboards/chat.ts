import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import PublicChatScrollerButton from "../actions/callback-query/chat/PublicChatScrollerButton"
import TogglePublicButton from "../actions/callback-query/chat/TogglePublicButton"

export const chatKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard
    }) => {
        keyboard.add(TogglePublicButton.button({
            ctx,
            data: {
                
            }
        }))
    }
)

export const startChatsKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)

        keyboard.add(PublicChatScrollerButton.button({
            ctx,
            key: 'button/show',
            data: {
                data: {
                    $typeName: 'ScrollerData',
                    id,
                    data: {
                        case: 'update',
                        value: false
                    }
                }
            }
        }))
    }
)