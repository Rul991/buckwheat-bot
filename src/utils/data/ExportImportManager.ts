import z, { literal, object, string } from "zod"
import ExportImportDefinition from "./ExportImportDefinition"
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_ROLEPLAY_NAME_LENGTH, MAX_ROLEPLAY_TEXT_LENGTH, MAX_USER_TEXT_LENGTH, MIN_DESCRIPTION_LENGTH, MIN_NAME_LENGTH, MIN_ROLEPLAY_NAME_LENGTH, MIN_ROLEPLAY_TEXT_LENGTH } from "../../consts/lengths"
import RoleplayService from "../../db/services/rp/RoleplayService"
import { GrammaticalCase } from "../../protos/rp_pb"
import RuleService from "../../db/services/chat/RuleService"
import Rule from "../../db/entities/chat/Rule"
import ChatService from "../../db/services/chat/ChatService"
import UserService from "../../db/services/user/UserService"
import UserAvaService from "../../db/services/user/UserAvaService"
import AvaHistory from "../../db/entities/user/AvaHistory"
import StringUtils from "../string/StringUtils"

export default class ExportImportManager {
    private static _definitions: Map<number, ExportImportDefinition<any>> = new Map(
        [
            new ExportImportDefinition({
                id: 0,
                key: 'rp',
                schema: object({
                    name: string()
                        .min(MIN_ROLEPLAY_NAME_LENGTH)
                        .max(MAX_ROLEPLAY_NAME_LENGTH),
                    case: z.enum(GrammaticalCase).default(GrammaticalCase.Genitive),
                    text: string()
                        .min(MIN_ROLEPLAY_TEXT_LENGTH)
                        .max(MAX_ROLEPLAY_TEXT_LENGTH)
                }).array(),
                importCallback: async (options) => {
                    const {
                        chatId,
                        data
                    } = options
                    if(!data.length) return true

                    await RoleplayService.createMany(
                        chatId,
                        data.map(v => {
                            return {
                                ...v,
                                id: chatId,
                                text: StringUtils.sanitizeHTML(v.text)
                            }
                        })
                    )

                    return true
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
                    hello: string().min(0).max(MAX_USER_TEXT_LENGTH)
                }),
                importCallback: async options => {
                    const {
                        chatId,
                        data
                    } = options

                    await Promise.all([
                        data.rules.length && RuleService.createMany(
                            data.rules.map(
                                v => {
                                    return new Rule({
                                        chatId,
                                        text: StringUtils.sanitizeHTML(v)
                                    })
                                }
                            )
                        ),
                        ChatService.update(
                            chatId,
                            {
                                hello: data.hello
                            }
                        )
                    ])

                    return true
                },
                exportCallback: async options => {
                    const {
                        chatId,
                        ctx
                    } = options

                    const rules = await RuleService.getAllByChatId(chatId)
                    const rulesText = rules.map(v => v.text)
                    const chat = await ctx.vars.chat.get()
                    const hello = chat?.hello ?? ''

                    return {
                        rules: rulesText,
                        hello
                    }
                }
            }),
            new ExportImportDefinition({
                id: 2,
                key: 'rules',
                schema: string().min(1).max(MAX_USER_TEXT_LENGTH).array().min(1),
                importCallback: async options => {
                    const {
                        chatId,
                        data: rules
                    } = options
                    if(!rules.length) return true

                    await RuleService.createMany(
                        rules.map(
                            v => {
                                return new Rule({
                                    chatId,
                                    text: StringUtils.sanitizeHTML(v)
                                })
                            }
                        )
                    )

                    return true
                },
                exportCallback: async options => {
                    const {
                        chatId
                    } = options
                    const rules = await RuleService.getAllByChatId(chatId)
                    const rulesText = rules.map(v => v.text)

                    return rulesText
                }
            }),
            new ExportImportDefinition({
                id: 3,
                forChat: false,
                key: 'profile',
                schema: object({
                    name: string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
                    description: string().min(MIN_DESCRIPTION_LENGTH).max(MAX_DESCRIPTION_LENGTH),
                    ava: object({
                        fileId: string().regex(/^[A-Za-z0-9_-]{20,200}$/),
                        type: literal(['animation', 'image', 'video'])
                    }).optional()
                }),
                importCallback: async options => {
                    const {
                        data,
                        chatId,
                        id
                    } = options

                    const {
                        name,
                        description,
                        ava
                    } = data

                    await UserService.updateOne(
                        chatId,
                        id,
                        {
                            name,
                            description: StringUtils.sanitizeHTML(description)
                        }
                    )

                    if (ava) {
                        await UserAvaService.set(
                            chatId,
                            id,
                            new AvaHistory(ava)
                        )
                    }

                    return true
                },
                exportCallback: async options => {
                    const {
                        ctx
                    } = options

                    const user = await ctx.vars.user.require()
                    return {
                        name: user.name,
                        description: user.description,
                        ava: user.currentAva ? {
                            fileId: user.currentAva.fileId,
                            type: user.currentAva.type
                        } : undefined
                    }
                }
            })
        ]
            .map(v => {
                return [v.id, v]
            })
    )

    static get(id: number): ExportImportDefinition<any> | undefined {
        return this._definitions.get(id)
    }

    static getAll(): ExportImportDefinition<any>[] {
        return this._definitions.values().toArray()
    }
}