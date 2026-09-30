import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import FaqScrollerButton from "../actions/callback-query/faq/FaqScrollerButton"

export const startFaqKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard,
    }) => {
        keyboard.add(FaqScrollerButton.button({
            ctx,
            data: {
                data: {
                    $typeName: 'ScrollerData',
                    data: {
                        case: 'update',
                        value: false
                    }
                }
            },
            key: 'button/show'
        }))
    }
)

export const backFaqKeyboard = KeyboardCreator.create<{
    page: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const {
            page
        } = data
        keyboard.add(
            FaqScrollerButton.button({
                ctx,
                data: {
                    data: {
                        data: {
                            case: 'page',
                            value: page
                        },
                        $typeName: 'ScrollerData'
                    }
                },
                key: 'button/back'
            })
        )
    }
)