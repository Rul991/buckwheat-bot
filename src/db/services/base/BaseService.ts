import { Types } from "mongoose"
import type { RepoExtends } from "../../../types/types"
import BaseRepository from "../../repos/base/BaseRepository"

export default class BaseService<T extends RepoExtends> {
    protected _repo: BaseRepository<T>

    constructor(obj: T) {
        this._repo = new BaseRepository(obj)
    }

    protected _getObjectIdFromBytes(bytes: Uint8Array): Types.ObjectId {
        return new Types.ObjectId(bytes)
    }

    async getAll() {
        return await this._repo.find()
    }

    async create(obj: InstanceType<T>): Promise<InstanceType<T>> {
        return await this._repo.create(obj)
    }

    async migrate(
        filter: Partial<InstanceType<T>>,
        value: Partial<InstanceType<T>>,
    ) {
        return await this._repo.updateMany(
            filter,
            value
        )
    }
}