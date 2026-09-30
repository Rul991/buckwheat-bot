import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import MarryButton from "../actions/callback-query/marriage/MarryButton"

export const startMarriageKeyboard = KeyboardCreator.create<{
    suggester: number
    target: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const suggester = BigInt(data.suggester)
        const target = BigInt(data.target)

        const defaultData = {
            suggester,
            target
        }

        keyboard.add(
            MarryButton.button({
                ctx,
                data: {
                    ...defaultData,
                    isAccept: true,
                },
                style: 'success'
            })
        )

        keyboard.add(
            MarryButton.button({
                ctx,
                data: {
                    ...defaultData,
                    isAccept: false,
                },
                style: 'danger'
            })
        )
    }
)