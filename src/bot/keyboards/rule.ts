import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import RuleAddButton from "../actions/callback-query/rule/RuleAddButton"
import RuleScrollerButton from "../actions/callback-query/rule/RuleScrollerButton"

export const startRuleKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data: {
            id
        },
        keyboard
    }) => {
        const bigId = BigInt(id)
        keyboard
            .add(RuleScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        data: {
                            case: 'update',
                            value: false
                        },
                    }
                },
                key: 'rule/button/start'
            }))
            .row()
        
        const [canAdd] = await RuleAddButton.checkRank(ctx)
        if(canAdd) {
            keyboard.add(RuleAddButton.button({
                ctx,
                data: {
                    id: bigId
                }
            }))
        }
    }
)