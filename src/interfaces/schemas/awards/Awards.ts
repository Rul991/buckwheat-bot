import Award from './Award'

export default interface Awards {
    id: number
    chatId: number
    awards?: Award[]
}