import z, { object, string } from "zod"
import ExportImportDefinition from "./ExportImportDefinition"
import { MAX_ROLEPLAY_NAME_LENGTH, MAX_ROLEPLAY_TEXT_LENGTH, MAX_USER_TEXT_LENGTH, MIN_ROLEPLAY_NAME_LENGTH, MIN_ROLEPLAY_TEXT_LENGTH } from "../../consts/lengths"
import RoleplayService from "../../db/services/rp/RoleplayService"
import { GrammaticalCase } from "../../protos/rp_pb"
import RuleService from "../../db/services/chat/RuleService"

export default class ExportImportManager {
    private static _definitions: ExportImportDefinition<any>[] = [
        new ExportImportDefinition({
            id: 0,
            key: 'rp',
            schema: object({
                name: string()
                    .min(MIN_ROLEPLAY_NAME_LENGTH)
                    .max(MAX_ROLEPLAY_NAME_LENGTH),
                case: z.enum(GrammaticalCase).default(GrammaticalCase.Dative),
                text: string()
                    .min(MIN_ROLEPLAY_TEXT_LENGTH)
                    .max(MAX_ROLEPLAY_TEXT_LENGTH)
            }).array(),
            importCallback: async (options) => {
                const {
                    chatId,
                    data
                } = options

                await RoleplayService.createMany(
                    chatId,
                    data.map(v => {
                        return {
                            ...v,
                            id: chatId
                        }
                    })
                )
            },
            exportCallback: async (options) => {
                const {
                    chatId
                } = options
                const roleplays = await RoleplayService.getAllByChatId(chatId)

                return roleplays.map(v => {
                    return {
                        name: v.name,
                        text: v.text,
                        case: v.case
                    }
                })
            }
        }),
        new ExportImportDefinition({
            id: 1,
            key: 'chat',
            schema: object({
                rules: string().min(1).max(MAX_USER_TEXT_LENGTH).array(),
                hello: string().min(1).max(MAX_USER_TEXT_LENGTH)
            }),
            importCallback: async options => {
                const {
                    chatId,
                    data
                } = options

                await Promise.all([
                    RuleService.createMany(
                        chatId,
                        data.rules
                    )
                ])
            },
            exportCallback: async options => {

            }
        })
    ]

    static getDefinition(id: number): ExportImportDefinition<any> | undefined {
        return this._definitions.find(v => v.id == id)
    }
}