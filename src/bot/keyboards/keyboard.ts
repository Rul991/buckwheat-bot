import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import OpenRandomPrizeButton from "../actions/callback-query/box/OpenRandomPrizeButton"

export const boxKeyboard = KeyboardCreator.create<{}>(
    async ({
        ctx,
        keyboard
    }) => {
        keyboard.add(OpenRandomPrizeButton.button({
            ctx,
            data: {},
        }))
    }
)