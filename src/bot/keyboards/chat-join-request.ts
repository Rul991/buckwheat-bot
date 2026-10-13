import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ChatJoinRequestButton from "../actions/callback-query/chat-join-request/ChatJoinRequestButton"

export const startJoinRequestKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)

        keyboard
            .add(
                ChatJoinRequestButton.button({
                    ctx,
                    data: {
                        id,
                        isAccept: true
                    },
                    style: 'success'
                }),
                ChatJoinRequestButton.button({
                    ctx,
                    data: {
                        id,
                        isAccept: false
                    },
                    style: 'danger'
                })
            )
    }
)