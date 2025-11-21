import Roleplays from '../../../../interfaces/schemas/chat/Roleplays'
import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import RoleplaysRepository from '../../repositories/RoleplaysRepository'

type RoleplayCommand = [string, string]

export default class RoleplaysService {
    static async get(chatId: number): Promise<Roleplays> {
        const found = await RoleplaysRepository.findOne(chatId)
        if(found) return found
        else return await RoleplaysRepository.create({id: chatId})
    }

    static async getCommands(chatId: number): Promise<RoleplayCommand[]> {
        const roleplays = await this.get(chatId)
        return roleplays.commands ?? []
    }

    static async getCommand(chatId: number, command: string): Promise<RoleplayCommand | null> {
        const commands = await this.getCommands(chatId)
        return commands.find(([name]) => name == command) ?? null
    }

    static async update(chatId: number, callback: (commands: RoleplayCommand[]) => RoleplayCommand[]): Promise<RoleplayCommand[] | null> {
        const commands = await this.getCommands(chatId)
        const newCommands = callback(commands)

        await RoleplaysRepository.updateOne(chatId, {commands: newCommands})

        if(commands.length != newCommands.length) {
            return newCommands
        }
        else {
            return null
        }
    }


    static async set(chatId: number, command: string, text: string): Promise<RoleplayCommand[] | null> {
        if(CommandDescriptionUtils.has(command)) return null
        return await this.update(chatId, commands => 
            [
                ...commands.filter(([name]) => name !== command),
                [command, text]
            ]
        )
    }

    static async delete(chatId: number, command: string): Promise<RoleplayCommand[] | null> {
        return await this.update(chatId, commands => 
            commands.filter(([name]) => name !== command)
        )
    }
}