import { Model, QueryFilter, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import BaseRepository from './BaseRepository'

export default class IdRepository<T extends typeof Model<K>, K extends { id: number }> extends BaseRepository<K, T> {
    async findOne(id: number, filter?: QueryFilter<K>): Promise<K | null> {
        return await super.findOne({ ...this._getFilter(filter), id })
    }

    async findMany(filter?: QueryFilter<K>): Promise<K[]> {
        return await super.findMany(this._getFilter(filter))
    }

    async deleteOne(id: number, filter?: QueryFilter<K>): Promise<K | null> {
        return await super.deleteOne({ ...this._getFilter(filter), id })
    }

    async updateOne(id: number, data: UpdateQuery<K>): Promise<K | null> {
        return await super.updateOne({ id }, data)
    }

    async updateMany(data: UpdateQuery<K>, filter?: QueryFilter<K>): Promise<UpdateWriteOpResult> {
        return await super.updateMany(this._getFilter(filter), data)
    }

    async getOrCreate(id: number, data: K): Promise<K> {
        return await super.getOrCreate({ id }, data)
    }

    async getMaxId() {
        const result = await this._Model
            .findOne()
            .sort({ id: -1 })
            .select('id')
            .exec()

        return result?.id as number ?? 0
    }
}