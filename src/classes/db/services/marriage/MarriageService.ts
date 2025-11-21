import Marriage from '../../../../interfaces/schemas/other/Marriage'
import MarriageRepository from '../../repositories/MarriageRepository'

export default class MarriageService {
    static async get(chatId: number, id: number): Promise<Marriage> {
        const marriage = await MarriageRepository.findOne(chatId, id)

        if(marriage) return marriage
        else return await MarriageRepository.create({id, chatId})
    }

    static async hasPartner(chatId: number, id: number): Promise<boolean> {
        const marriage = await this.get(chatId, id)
        return Boolean(marriage.partnerId)
    }

    static async marry(chatId: number, userId: number, partnerId: number): Promise<boolean> {
        const userMarriage = await this.get(chatId, userId)
        const partnerMarriage = await this.get(chatId, partnerId)

        if(userMarriage.partnerId || partnerMarriage.partnerId) {
            return false
        }
        else {
            const marriage = {
                startedAt: Date.now()
            }

            await MarriageRepository.updateOne(
                chatId,
                userId,
                {
                    ...marriage,
                    partnerId
                }
            )

            await MarriageRepository.updateOne(
                chatId,
                partnerId,
                {
                    ...marriage,
                    partnerId: userId
                }
            )
            return true
        }
    }

    static async divorce(chatId: number, userId: number, partnerId: number): Promise<boolean> {
        const userMarriage = await this.get(chatId, userId)
        const partnerMarriage = await this.get(chatId, partnerId)

        if(userMarriage.partnerId == partnerId && partnerMarriage.partnerId == userId) {
            const marriage = {
                $set: {
                    startedAt: null,
                    partnerId: null
                }
            }

            await MarriageRepository.updateOne(
                chatId,
                userId,
                marriage
            )

            await MarriageRepository.updateOne(
                chatId,
                partnerId,
                marriage
            )
            return true
        }
        else {
            return false
        }
    }
}