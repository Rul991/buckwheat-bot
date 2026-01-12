import MoneyGenerator from './MoneyGenerator'

export default interface Generators {
    chatId: number
    id: number
    generators: MoneyGenerator[]
    lastCheckTime: number
}