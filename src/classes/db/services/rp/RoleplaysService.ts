import Roleplays from '../../../../interfaces/schemas/chat/Roleplays'
import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import RoleplaysRepository from '../../repositories/RoleplaysRepository'

type RoleplayCommand = [string, string]

export default class RoleplaysService {
    static async get(chatId: number): Promise<Roleplays> {
        const found = await RoleplaysRepository.findOne(chatId)
        if(found) return found
        else return await RoleplaysRepository.create({id: chatId})
    }

    static async addCommands(chatId: number, newCommands: Roleplays['commands'] & {}) {
        const currentCommands = await this.getCommands(chatId)

        for (const command of newCommands) {
            const [name] = command
            const index = currentCommands.findIndex(
                ([currentName]) => {
                    return name == currentName
                }
            )

            if(index === NOT_FOUND_INDEX) {
                currentCommands.push(command)
            }
            else {
                currentCommands[index] = command
            }
        }

        await RoleplaysRepository.updateOne(
            chatId,
            {
                commands: currentCommands
            }
        )
        return currentCommands
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
        
        if(commands.length != newCommands.length) {
            await RoleplaysRepository.updateOne(chatId, {commands: newCommands})
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

    static async deleteAll(chatId: number) {
        return await RoleplaysRepository.deleteOne(chatId)
    }
}