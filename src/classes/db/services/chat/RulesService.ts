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

    static async add(chatId: number, data: string): Promise<void> {
        this._updateRules(
            chatId,
            rules => {
                rules.push(data)
                return rules
            }
        )
    }

    static async delete(chatId: number, index: number): Promise<void> {
        this._updateRules(
            chatId,
            (rules) => {
                rules.splice(index, 1)
                return rules
            }
        )
    }

    static async edit(chatId: number, index: number, data: string): Promise<void> {
        this._updateRules(
            chatId,
            rules => {
                rules.splice(index, 1, data)
                return rules
            }
        )
    }
}