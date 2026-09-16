import Rule from "../../entities/chat/Rule"
import BaseService from "../base/BaseService"

class RuleService extends BaseService<typeof Rule> {
    constructor() {
        super(Rule)
    }

    async createMany(rules: Rule[]) {
        for (const rule of rules) {
            await this.create(rule)
        }
    }

    async updateText(chatId: number, id: number, text: string): Promise<Rule | undefined> {
        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                text
            }
        )
    }

    async delete(chatId: number, id: number): Promise<boolean> {
        const result = await this._repo.deleteOne({
            chatId,
            id
        })
        return result.deletedCount > 0
    }

    async getAllByChatId(chatId: number): Promise<Rule[]> {
        return this._repo.find({
            chatId
        })
    }

    async count(chatId: number): Promise<number> {
        return await this._repo.count({ chatId })
    }
}

export default new RuleService()