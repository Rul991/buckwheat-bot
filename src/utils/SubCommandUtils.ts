import StringUtils from './StringUtils'
import { NameObject, SubCommandOptions } from './types'

export default class SubCommandUtils {
    static getSubCommandAndData<Command extends NameObject>(
        text?: string, 
        availableCommands: Command[] = [], 
        {
            withTab = false
        }: SubCommandOptions = {}
    ): [Command, string] | ('no-text' | 'not-exist') {
        if(!text) return 'no-text'
        
        const [command, data] = this.splitCommandOther(text, withTab)
        const lowerCommand = command.toLowerCase()

        for (const command of availableCommands) {
            if(command.name == lowerCommand) {
                return [command, data]
            }
        }

        return 'not-exist'
    }

    static splitCommandOther(text: string, withTab: boolean): [string, string] {
        const [command, ...nonSplittedData] = text.split(' ')
        const data = StringUtils
            .replaceToNewLine(
            nonSplittedData
                .join(' '),
                withTab
            )

        return [command, data]
    }

    static getArgumentText<T extends NameObject>(arr: T[]) {
        return arr
            .reduce((prev, curr, i) => 
                `${prev}${curr.name}${i < arr.length - 1 ? ' | ' : ''}`, 
            ''
        )
    }
}