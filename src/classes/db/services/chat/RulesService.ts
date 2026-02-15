import ChatRepository from '../../repositories/ChatRepository'
import ChatService from './ChatService'

export default class RulesService {
    private static async _updateRules(
        chatId: number,
        cb: (rules: string[]) => string[]
    ): Promise<void> {
        const rules = await this.get(chatId)
        const newRules = cb(rules)

        await this.get(chatId)
        await ChatRepository.updateOne(chatId, {rules: newRules})
    }

    static async get(chatId: number): Promise<string[]> {
        return (await ChatService.get(chatId))?.rules ?? []
    }

    static async set(chatId: number, data: string[]): Promise<void> {
        await this._updateRules(
            chatId,
            rules => {
                return data
            }
        )
    }

    static async clean(chatId: number): Promise<void> {
        await this._updateRules(
            chatId,
            _ => {
                return []
            }
        )
    }

    static async add(chatId: number, ...data: string[]): Promise<void> {
        await this._updateRules(
            chatId,
            rules => {
                rules.push(...data)
                return rules
            }
        )
    }

    static async extend(chatId: number, index: number, data: string) {
        let result = true
        await this._updateRules(
            chatId,
            (rules) => {
                const rule = rules[index]
                if(!rule) {
                    result = false
                    return rules
                }

                rules[index] = `${rule}\n\n${data}`

                return rules
            }
        )

        return result
    }

    static async delete(chatId: number, index: number): Promise<void> {
        await this._updateRules(
            chatId,
            (rules) => {
                rules.splice(index, 1)
                return rules
            }
        )
    }
}