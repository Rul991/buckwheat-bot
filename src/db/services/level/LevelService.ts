import ExperienceUtils from "../../../utils/level/ExperienceUtils"
import LevelUtils from "../../../utils/level/LevelUtils"
import Level from "../../entities/level/Level"
import BaseService from "../base/BaseService"

class LevelService extends BaseService<typeof Level> {
    constructor() {
        super(Level)
    }

    async get(chatId: number, id: number): Promise<Level> {
        return this._repo.getOrCreate(
            {
                chatId,
                id,
            },
            new Level({
                chatId,
                id
            })
        )
    }

    async add(chatId: number, id: number, experience: number): Promise<Level | undefined> {
        const {
            currentExperience,
        } = await this.get(chatId, id)
        const newExperience = ExperienceUtils.clamp(currentExperience + experience)
        const isLevelUpChecked = newExperience <= currentExperience

        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                currentExperience: newExperience,
                isLevelUpChecked
            }
        )
    }

    async reset(chatId: number, id: number): Promise<Level | undefined> {
        return await this._repo.updateOne(
            {
                chatId,
                id
            },
            {
                prevExperience: ExperienceUtils.min,
                currentExperience: ExperienceUtils.min,
                isLevelUpChecked: true
            }
        )
    }

    async getLevelUps(chatId: number, id: number): Promise<[number, number]> {
        const level = await this.get(chatId, id)
        const [levelUps, currentLevel] = LevelUtils.getLevelUps(level)

        if (levelUps > 0) {
            await this._repo.updateOne(
                {
                    chatId,
                    id
                },
                {
                    prevExperience: level.currentExperience,
                    isLevelUpChecked: true
                }
            )
        }

        return [levelUps, currentLevel]
    }

    async getCurrentLevel(chatId: number, id: number): Promise<number> {
        const {
            currentExperience
        } = await this.get(chatId, id)

        return LevelUtils.get(currentExperience)
    }

    async getAllByChatId(chatId: number): Promise<Level[]> {
        return this._repo.find({ chatId })
    }
}

export default new LevelService