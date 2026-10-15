import GeneratorService from "../../db/services/generator/GeneratorService"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import GeneratorAddButton from "../actions/callback-query/generator/GeneratorAddButton"
import GeneratorCollectButton from "../actions/callback-query/generator/GeneratorCollectButton"
import GeneratorUpgradeButton from "../actions/callback-query/generator/GeneratorUpgradeButton"

export const generatorKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = data.id
        const bigId = BigInt(id)
        const chatId = ctx.vars.chatId!
        const availableGenerators = await GeneratorService.getAvailableGenerators(chatId, id)
        const { levels, price } = await GeneratorService.getUpgradeInfo(chatId, id)

        keyboard
            .add(
                GeneratorCollectButton.button({
                    ctx,
                    data: {
                        id: bigId
                    },
                    style: 'success'
                })
            )

        if (availableGenerators > 0) {
            keyboard.add(
                GeneratorAddButton.button({
                    ctx,
                    data: {
                        id: bigId
                    },
                })
            )
        }

        if(levels > 0) {
            keyboard.add(
                GeneratorUpgradeButton.button({
                    ctx,
                    data: {
                        id: bigId
                    },
                    vars: {
                        price,
                        levels
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }
)