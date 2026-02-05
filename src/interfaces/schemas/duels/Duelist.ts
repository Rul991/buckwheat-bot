export default interface Duelist {
    id: number
    chatId: number
    hp: number
    mana: number
    onDuel?: boolean
    lastSave?: number
    wins: number
    loses: number
    lastMessage?: number
}