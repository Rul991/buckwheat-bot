import { literal, number, object, record, string, tuple, ZodType } from 'zod'
import UserRankService from '../classes/db/services/user/UserRankService'
import RoleplaysService from '../classes/db/services/rp/RoleplaysService'
import Roleplays from '../interfaces/schemas/chat/Roleplays'
import ObjectValidator from './ObjectValidator'
import JsonUtils from './JsonUtils'
import RankUtils from './RankUtils'
import RulesService from '../classes/db/services/chat/RulesService'
import ChatService from '../classes/db/services/chat/ChatService'
import { MAX_DESCRIPTION_LENGTH, MAX_EXPORT_DATA_LENGTH, MAX_NAME_LENGTH, MAX_RANK_NAME_LENGTH, MIN_RANK_NAME_LENGTH, UNKWOWN_IMPORT_TITLE } from './values/consts'
import UserProfileService from '../classes/db/services/user/UserProfileService'
import UserNameService from '../classes/db/services/user/UserNameService'
import ChatSettingsService from '../classes/db/services/settings/ChatSettingsService'
import CommandAccessService from '../classes/db/services/settings/access/CommandAccessService'
import { ranksSchema } from './values/schemas'
import ButtonAccessService from '../classes/db/services/settings/access/ButtonAccessService'
import RankSettingsService from '../classes/db/services/settings/RankSettingsService'
import ArrayUtils from './ArrayUtils'

type ExportOptions = {
    chatId: number
    id: number
}

type ImportOptions<T extends object> = ExportOptions & {
    data: T
}

type ImportResult = {
    imported: boolean,
    value?: Data<any>
}

type SerializeOptions<O extends ExportOptions> = O & {
    name: string
    defaultValue?: DefaultValue
}

type Data<T extends object = any> = {
    id: string
    title: string
    description?: string
    schema: ZodType<T>,
    import: (options: ImportOptions<T>) => Promise<void>
    export: (options: ExportOptions) => Promise<T>
    type: SerializeType
}

type SerializeType = 'chat' | 'user'
type DefaultValue = {} | []

export default class {
    static needRank = RankUtils.max
    private static _values: Data[] = [
        {
            id: 'rp',
            title: 'РП',
            description: 'Добавляет новые или заменяет существующие команды',
            schema: string().array().min(2),
            type: 'chat',
            import: async (options: ImportOptions<object>): Promise<void> => {
                const {
                    chatId,
                    data: raw
                } = options

                const commands = raw as Roleplays['commands'] & {}
                await RoleplaysService.addCommands(chatId, commands)
            },
            export: async (options: ExportOptions): Promise<object> => {
                const {
                    chatId
                } = options

                return await RoleplaysService.getCommands(chatId)
            }
        },

        {
            id: 'chat',
            title: 'Чат',
            description: 'Заменяет правила и приветствие',
            schema: object({
                rules: string().max(MAX_EXPORT_DATA_LENGTH).array(),
                hello: string().max(MAX_EXPORT_DATA_LENGTH),
            }),
            import: async options => {
                const {
                    chatId,
                    data
                } = options

                await ChatService.set(
                    chatId,
                    data
                )
            },
            export: async options => {
                const {
                    chatId
                } = options

                const chat = await ChatService.get(chatId)
                const {
                    hello = '',
                    rules = []
                } = chat

                return {
                    rules,
                    hello
                }
            },
            type: 'chat'
        },

        {
            id: 'rules',
            title: 'Правила',
            description: 'Добавляет правила',
            schema: string().array(),
            type: 'chat',
            import: async (options: ImportOptions<object>): Promise<void> => {
                const {
                    chatId,
                    data: raw
                } = options

                const commands = raw as string[]
                await RulesService.add(chatId, ...commands)
            },
            export: async (options: ExportOptions): Promise<object> => {
                const {
                    chatId
                } = options

                return await RulesService.get(chatId)
            }
        },

        {
            id: 'profile',
            title: 'Профиль',
            description: 'Заменяет ваши ник, описание и аватарку',
            schema: object({
                name: string().max(MAX_NAME_LENGTH),
                description: string().max(MAX_DESCRIPTION_LENGTH).optional(),
                imageId: string().optional()
            }),
            type: 'user',
            import: async (options: ImportOptions<object>): Promise<void> => {
                const {
                    chatId,
                    id,
                    data: raw
                } = options

                type Data = {
                    name: string,
                    description?: string,
                    imageId?: string
                }

                const data = raw as Data
                await UserProfileService.update(
                    chatId,
                    id,
                    {
                        ...data,
                        name: await UserNameService.getUniqueName(chatId, data.name)
                    }
                )
            },
            export: async (options: ExportOptions): Promise<object> => {
                const {
                    chatId,
                    id
                } = options

                const user = await UserProfileService.create(chatId, id)
                const {
                    name,
                    description,
                    imageId
                } = user

                return {
                    name,
                    description,
                    imageId
                }
            }
        },

        {
            id: 'cmd-access',
            title: 'Ранг команд',
            description: 'Определяет ранги команд в чате',
            schema: ranksSchema,
            import: async (options: ImportOptions<Record<string, number>>): Promise<void> => {
                const {
                    chatId,
                    data
                } = options

                await CommandAccessService.setMany(
                    chatId,
                    new Map(Object.entries(data))
                )
            },
            export: async (options: ExportOptions): Promise<Record<string, number>> => {
                const {
                    chatId,
                } = options
                const result: Record<string, number> = await CommandAccessService.getObject(chatId)

                return result
            },
            type: 'chat'
        },

        {
            id: 'btn-access',
            title: 'Ранг кнопок',
            description: 'Определяет ранги кнопок в чате',
            schema: ranksSchema,
            import: async (options: ImportOptions<Record<string, number>>): Promise<void> => {
                const {
                    chatId,
                    data
                } = options

                await ButtonAccessService.setMany(
                    chatId,
                    new Map(Object.entries(data))
                )
            },
            export: async (options: ExportOptions): Promise<Record<string, number>> => {
                const {
                    chatId,
                } = options
                const result: Record<string, number> = await ButtonAccessService.getObject(chatId)

                return result
            },
            type: 'chat'
        },

        {
            id: 'ranks',
            title: 'Имена рангов',
            description: 'Определяет имена рангов в чате',
            schema: record(
                literal(
                    ArrayUtils.range(-1, 5)
                        .map(v => `rank-${v}`)
                ),
                string()
                    .min(MIN_RANK_NAME_LENGTH)
                    .max(MAX_RANK_NAME_LENGTH)
            ),
            import: async (options: ImportOptions<Record<string, string>>): Promise<void> => {
                const {
                    chatId,
                    data
                } = options

                await RankSettingsService.setMany(
                    chatId,
                    new Map(Object.entries(data))
                )
            },
            export: async (options: ExportOptions): Promise<Record<string, string>> => {
                const {
                    chatId,
                } = options
                const result: Record<string, string> = await RankSettingsService.getObject(chatId)

                return result
            },
            type: 'chat'
        },
    ]

    static getById(id: string) {
        return this._values.find((v) => v.id == id)
    }

    static getTitleByData(data?: Data | null) {
        return data?.title ?? UNKWOWN_IMPORT_TITLE
    }

    static getTitleById(id: string) {
        const data = this.getById(id)
        return this.getTitleByData(data)
    }

    static getValues() {
        return this._values
    }

    static async import(options: SerializeOptions<Omit<ImportOptions<any>, 'data'> & { data: string }>): Promise<ImportResult> {
        const {
            name,
            data,
            chatId,
            id
        } = options

        const value = this.getById(name)
        if (!value) return {
            imported: false
        }

        const {
            schema,
            type
        } = value

        const needRank = this.needRank
        const canUse = type == 'user' ||
            (type == 'chat' && await UserRankService.has(chatId, id, needRank))

        if (!canUse) return {
            imported: false,
            value: value
        }

        const parsed = JsonUtils.parse(data)
        if (!ObjectValidator.isValidatedObject(parsed, schema)) return {
            imported: false,
            value: value
        }

        await value.import({
            ...options,
            data: parsed
        })
        return {
            imported: true,
            value: value
        }
    }

    static async export(options: SerializeOptions<ExportOptions>) {
        const {
            name,
            defaultValue = []
        } = options

        const value = this.getById(name)
        const exported = value ? await value.export(options) : defaultValue

        return {
            value,
            exported: JSON.stringify(exported)
        }
    }
}