import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import IdeaScrollerButton from "../actions/callback-query/ideas/IdeaScrollerButton"

export const startIdeaKeyboard = KeyboardCreator.create<{
    id: number
    page?: number
}>(
    async ({
        keyboard,
        ctx,
        data: {
            id,
            page
        }
    }) => {
        keyboard.add(
            IdeaScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id: BigInt(id),
                        data: page ?
                            {
                                case: 'page',
                                value: page
                            } :
                            {
                                case: 'update',
                                value: false
                            }
                    }
                },
                key: 'idea/start-button'
            })
        )
    }
)