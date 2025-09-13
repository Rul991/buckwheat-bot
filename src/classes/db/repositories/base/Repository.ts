import { Model, RootFilterQuery, UpdateQuery } from 'mongoose'
import BaseRepository from './BaseRepository'

export default class Repository<T extends typeof Model, K> extends BaseRepository<K, T> {
    async findOne(filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.findOne(this._getFilter(filter))
    }

    async deleteOne(filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.deleteOne(this._getFilter(filter))
    }

    async findMany(filter?: RootFilterQuery<K>): Promise<K[]> {
        return await super.findMany(this._getFilter(filter))
    }

    async updateOne(data: UpdateQuery<K>, filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.updateOne(this._getFilter(filter), data)
    }
}