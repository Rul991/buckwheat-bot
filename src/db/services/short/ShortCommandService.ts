import { Types, type DeleteResult } from "mongoose"
import ShortCommand from "../../entities/short/ShortCommand"
import BaseService from "../base/BaseService"

class ShortCommandService extends BaseService<typeof ShortCommand> {
    constructor() {
        super(ShortCommand)
    }

    override async create(obj: ShortCommand): Promise<ShortCommand & { new?: true }> {
        return await this._repo.updateOrCreate(
            {
                id: obj.id,
                command: obj.command
            },
            obj
        )
    }

    async get(objectId: Uint8Array): Promise<ShortCommand | undefined> {
        return await this._repo.findOne({
            _id: new Types.ObjectId(objectId)
        })
    }

    async getByName(id: number, command: string): Promise<ShortCommand | undefined> {
        return await this._repo.findOne({
            id,
            command
        })
    }

    async getAllByUserId(id: number): Promise<ShortCommand[]> {
        return await this._repo.find({ id })
    }

    async delete(objectId: Uint8Array): Promise<DeleteResult> {
        return await this._repo.deleteOne({
            _id: new Types.ObjectId(objectId)
        })
    }
}

export default new ShortCommandService()