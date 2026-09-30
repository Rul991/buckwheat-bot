import type ExportImportDefinition from "../../utils/data/ExportImportDefinition"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ExportButton from "../actions/callback-query/export-import/ExportButton"
import ExportImportScrollerButton from "../actions/callback-query/export-import/ExportImportScrollerButton"
import ImportButton from "../actions/callback-query/export-import/ImportButton"

export const startExportImportKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)

        keyboard.add(
            ExportImportScrollerButton.button({
                ctx,
                key: 'button/show',
                data: {
                    data: {
                        id,
                        data: {
                            case: 'update',
                            value: false
                        },
                        $typeName: 'ScrollerData',
                    }
                }
            })
        )
    }
)

export const showExportImportKeyboard = KeyboardCreator.create<{
    id: number
    page: number
    definition: ExportImportDefinition<any>
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            page,
            definition
        } = data
        const definitionId = definition.id

        keyboard.add(
            ImportButton.button({
                ctx,
                data: {
                    id,
                    definitionId
                }
            }),
            ExportButton.button({
                ctx,
                data: {
                    id,
                    definitionId
                }
            }),
            ExportImportScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id,
                        data: {
                            case: 'page',
                            value: page
                        },
                    },
                },
                key: 'button/back'
            })
        )

        return keyboard.toFlowed(1)
    }
)