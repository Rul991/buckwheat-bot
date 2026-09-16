import type { GrammaticalCase } from "../../../protos/rp_pb"
import Roleplay from "../../entities/rp/Roleplay"
import BaseService from "../base/BaseService"

class RoleplayService extends BaseService<typeof Roleplay> {
    constructor() {
        super(Roleplay)
    }

    override async create(obj: Roleplay): Promise<Roleplay & { new?: true }> {
        const filter = {
            id: obj.id,
            name: obj.name
        }

        return await this._repo.updateOrCreate(
            filter,
            obj
        )
    }

    async createMany(chatId: number, array: Roleplay[]) {
        return await this._repo.updateOrCreateMany(
            {
                id: chatId
            },
            array
        )
    }

    async getAllByChatId(chatId: number): Promise<Roleplay[]> {
        return this._repo.find({ id: chatId })
    }

    async count(chatId: number): Promise<number> {
        return this._repo.count({ id: chatId })
    }

    async get(objectId: Uint8Array): Promise<Roleplay | undefined> {
        return this._repo.findOne({
            _id: this._getObjectIdFromBytes(objectId)
        })
    }

    async getByName(chatId: number, name: string): Promise<Roleplay | undefined> {
        return this._repo.findOne({
            id: chatId,
            name
        })
    }

    async changeCase(objectId: Uint8Array, caseValue: GrammaticalCase): Promise<Roleplay | undefined> {
        return await this._repo.updateOne(
            {
                _id: this._getObjectIdFromBytes(objectId)
            },
            {
                case: caseValue
            }
        )
    }

    async editText(objectId: Uint8Array, text: string): Promise<Roleplay | undefined> {
        return await this._repo.updateOne(
            {
                _id: this._getObjectIdFromBytes(objectId)
            },
            {
                text
            }
        )
    }

    async delete(objectId: Uint8Array): Promise<boolean> {
        const result = await this._repo.deleteOne({
            _id: this._getObjectIdFromBytes(objectId)
        })
        return result.acknowledged
    }
}

export default new RoleplayService()