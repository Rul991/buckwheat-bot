import ChatRepository from '../../repositories/ChatRepository'

export default class RulesService {
    private static async _updateRules(
        cb: (rules: string[]) => string[]
    ): Promise<void> {
        const rules = await this.get()
        const newRules = cb(rules)

        await ChatRepository.updateOne({rules: newRules})
    }

    static async get(): Promise<string[]> {
        return (await ChatRepository.get()).rules ?? []
    }

    static async add(data: string): Promise<void> {
        this._updateRules(
            (rules) => {
                rules.push(data)
                return rules
            }
        )
    }

    static async delete(index: number): Promise<void> {
        this._updateRules(
            (rules) => {
                rules.splice(index, 1)
                return rules
            }
        )
    }

    static async edit(index: number, data: string): Promise<void> {
        this._updateRules(
            (rules) => {
                rules.splice(index, 1, data)
                return rules
            }
        )
    }
}