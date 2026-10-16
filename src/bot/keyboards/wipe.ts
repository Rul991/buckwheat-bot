import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import WipeButton from "../actions/callback-query/wipe/WipeButton"

export const chooseWipeKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)

        keyboard.add(
            WipeButton.button({
                ctx,
                data: {
                    id,
                    isWipe: true
                }
            }),
            WipeButton.button({
                ctx,
                data: {
                    id,
                    isWipe: false
                }
            })
        )
    }
)