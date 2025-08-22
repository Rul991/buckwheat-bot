import ChatRepository from '../../repositories/ChatRepository'

export default class HelloService {
    static async get(): Promise<string> {
        return (await ChatRepository.findOne())?.hello ?? ''
    }

    static async edit(text: string): Promise<void> {
        await ChatRepository.updateOne({hello: text})
    }
}