import { Model, QueryFilter, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import BaseRepository from './BaseRepository'

export default class Repository<T extends typeof Model, K> extends BaseRepository<K, T> {
    async findOne(filter?: QueryFilter<K>): Promise<K | null> {
        return await super.findOne(this._getFilter(filter))
    }

    async deleteOne(filter?: QueryFilter<K>): Promise<K | null> {
        return await super.deleteOne(this._getFilter(filter))
    }

    async findMany(filter?: QueryFilter<K>): Promise<K[]> {
        return await super.findMany(this._getFilter(filter))
    }

    async updateOne(data: UpdateQuery<K>, filter?: QueryFilter<K>): Promise<K | null> {
        return await super.updateOne(this._getFilter(filter), data)
    }
    
    async updateMany(data: UpdateQuery<K>, filter?: QueryFilter<K>): Promise<UpdateWriteOpResult> {
        return await super.updateMany(this._getFilter(filter), data)
    }

    async getOrCreate(data: K): Promise<K> {
        return await super.getOrCreate({}, data)
    }
}