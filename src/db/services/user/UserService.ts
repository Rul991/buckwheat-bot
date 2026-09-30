import type { User as GrammyUser } from "grammy/types"
import { MAX_NAME_LENGTH } from "../../../consts/lengths"
import User from "../../entities/user/User"
import BaseService from "../base/BaseService"
import { UNKNOWN_NAME } from "../../../consts/texts"

class UserService extends BaseService<typeof User> {
    constructor() {
        super(User)
    }

    override async create(user: User): Promise<User> {
        const {
            chatId,
            id
        } = user
        return await this._repo.getOrCreate(
            {
                chatId,
                id
            },
            async () => ({
                ...user,
                username: user.username?.toLowerCase(),
                name: await this.getUniqueName(user.chatId, user.name)
            } as User)
        )
    }

    async defaultCreate(chatId: number, id: number, from: GrammyUser): Promise<User> {
        const name = from.first_name
        const isBot = from.is_bot
        return this.create(
            new User({
                chatId,
                id,
                name,
                className: isBot ? 'bot' : 'unknown',
                username: from.username ?? '',
            })
        )
    }

    async getByName(chatId: number, name: string): Promise<User | undefined> {
        return await this._repo.findOne({
            chatId,
            name
        })
    }

    async getByUsername(chatId: number, username: string): Promise<User | undefined> {
        return await this._repo.findOne({
            chatId,
            username: username.toLowerCase()
        })
    }

    async get(chatId: number, id: number): Promise<User | undefined> {
        return await this._repo.findOne({
            chatId,
            id
        })
    }

    async getAllByChatId(chatId: number): Promise<User[]> {
        return await this._repo.find({
            chatId
        })
    }

    async updateOne(chatId: number, id: number, user: Partial<User>): Promise<User | undefined> {
        return await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id
            },
            {
                ...user,
                updatedAt: new Date(),
                $inc: {
                    classChangedCount: +(user.className !== undefined)
                }
            },
            {
                lean: true,
                returnDocument: 'after',
            }
        ).exec() ?? undefined
    }

    async getUniqueName(chatId: number, name: string): Promise<string> {
        const shortenName = name
            .slice(0, MAX_NAME_LENGTH)
            .replaceAll('@', '')
            .trim() || UNKNOWN_NAME
        const names = await this.getAllByChatId(chatId)

        let index = 1
        let newName = shortenName

        while (true) {
            const user = names.find(user => user.name == newName)
            if (!user) return newName

            newName = (shortenName + ` (${index})`)
            newName = newName.slice(Math.max(0, newName.length - MAX_NAME_LENGTH))
            index++
        }
    }

    async getRandom(chatId: number): Promise<User | undefined> {
        return (await this._repo.model.aggregate([
            { $match: { chatId } },
            { $sample: { size: 1 } },
        ]).exec())[0]
    }

    async getAllByIds(chatId: number, ids: number[]): Promise<Map<number, User>> {
        const result = new Map<number, User>()
        const users = await this._repo.find(
            {
                id: {
                    $in: ids
                },
                chatId,
            },
        )

        for (const user of users) {
            result.set(user.id, user)
        }

        return result
    }

    async getUniqueUsersCount(): Promise<number> {
        const result = await this._repo.model.aggregate([
            { $group: { _id: "$id" } },
            { $count: "uniqueCount" }
        ])
        return result.length ? result[0].uniqueCount : 0
    }

    async count(): Promise<number> {
        return await this._repo.count()
    }
}

export default new UserService()