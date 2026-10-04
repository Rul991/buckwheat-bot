import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import JoinChatButton from "../actions/callback-query/new-chat-member/JoinChatButton"

export const helloNewChatMemberKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        keyboard.add(JoinChatButton.button({
            ctx,
            data: {
                id
            }
        }))
    }
)