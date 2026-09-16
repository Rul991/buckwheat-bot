import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
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