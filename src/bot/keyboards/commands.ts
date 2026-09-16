import CommandDescriptionUtils from "../../utils/command/CommandDescriptionUtils"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import CommandsScrollerButton from "../actions/callback-query/commands/CommandsScrollerButton"

export const commandsListKeyboard = KeyboardCreator.create<{}>(
    async ({
        ctx,
        keyboard,
    }) => {
        const buttons = CommandDescriptionUtils.types.map(v => CommandsScrollerButton.button({
            ctx,
            key: 'commands/types/types',
            data: {
                type: v,
                data: {
                    $typeName: 'ScrollerData',
                    data: {
                        case: 'update',
                        value: false
                    },
                }
            }
        }))

        for (const button of buttons) {
            keyboard
                .row()
                .add(
                    button
                )
        }
    }
)