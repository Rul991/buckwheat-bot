import type { Dev } from "../../protos/dev_pb"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import DevButton from "../actions/callback-query/dev/DevButton"

export const devKeyboard = KeyboardCreator.create<Dev>(
    async ({
        data,
        ctx,
        keyboard
    }) => {
        keyboard.add(DevButton.button({
            ctx,
            data,
        }))
    }
)