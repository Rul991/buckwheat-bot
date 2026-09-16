import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import CubeStartButton from "../actions/callback-query/cube/CubeStartButton"

export const cubeStartKeyboard = KeyboardCreator.create<{
    first: number
    second: number
    bet: number
}>(
    async ({
        data,
        ctx,
        keyboard
    }) => {
        const {
            first,
            second,
            bet
        } = data

        const partialData = {
            first: BigInt(first),
            second: BigInt(second),
            bet
        }

        keyboard.add(
            CubeStartButton.button({
                ctx,
                data: {
                    ...partialData,
                    isAgree: true
                }
            }),
            CubeStartButton.button({
                ctx,
                data: {
                    ...partialData,
                    isAgree: false
                }
            })
        )
    }
)