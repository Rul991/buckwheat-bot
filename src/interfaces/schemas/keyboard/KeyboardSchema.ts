export default interface KeyboardSchema {
    id: number
    chatId: number
    messageId: number
    keyboard: string[][]
    createdAt: Date
}