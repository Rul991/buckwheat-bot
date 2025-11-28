import StringUtils from './StringUtils'
import { SubCommandObject } from './values/types/types'

export default class SubCommandUtils {
    static getSubCommandAndData<Command extends SubCommandObject>(
        text?: string, 
        availableCommands: Command[] = []
    ): [Command, string] | ('no-text' | 'not-exist') {
        if(!text) return 'no-text'
        
        const [command, data] = this.splitCommandOther(text)
        const lowerCommand = command.toLowerCase()

        for (const command of availableCommands) {
            if(command.name == lowerCommand) {
                return [command, data]
            }
        }

        return 'not-exist'
    }

    static splitCommandOther(text: string): [string, string] {
        const [command, data] = StringUtils.splitByCommands(text, 1)
        return [command, data]
    }

    static getArgumentText<T extends SubCommandObject>(arr: T[]) {
        return arr
            .reduce((prev, curr, i) => 
                `${prev}${curr.name}${i < arr.length - 1 ? ' | ' : ''}`, 
            ''
        )
    }
}