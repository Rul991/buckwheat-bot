export default interface SimpleCommand {
    name: string
    src?: string | string[]
    text?: string | string[]
    avoidOther?: boolean
    aliases?: string[]
}