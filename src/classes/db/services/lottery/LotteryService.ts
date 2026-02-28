import Lottery from '../../../../interfaces/schemas/lottery/Lottery'
import LotteryRepository from '../../repositories/LotteryRepository'

type CreateLottery = Omit<Lottery, 'id'>

export default class {
    static async get(id: number) {
        return await LotteryRepository.findOne(id)
    }

    static async getAllPublic(chatId: number) {
        return await LotteryRepository.findMany({
            chatId,
            isPublic: true
        })
    }

    static async create(data: CreateLottery) {
        const id = await LotteryRepository.getMaxId() + 1
        return await LotteryRepository.create({
            ...data,
            id
        })
    }

    static async wipe(chatId: number) {
        return await LotteryRepository.deleteMany({ chatId })
    }

    static async delete(id: number) {
        return await LotteryRepository.deleteOne(id)
    }
}