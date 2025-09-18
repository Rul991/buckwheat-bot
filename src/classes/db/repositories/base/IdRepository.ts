import { Model, RootFilterQuery, UpdateQuery, UpdateWriteOpResult } from 'mongoose'
import BaseRepository from './BaseRepository'

export default class IdRepository<T extends typeof Model, K extends {id: number}> extends BaseRepository<K, T> {
    async findOne(id: number, filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.findOne({...this._getFilter(filter), id})
    }

    async findMany(filter?: RootFilterQuery<K>): Promise<K[]> {
        return await super.findMany(this._getFilter(filter))
    }

    async deleteOne(id: number, filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.deleteOne({...this._getFilter(filter), id})
    }

    async updateOne(id: number, data: UpdateQuery<K>): Promise<K | null> {
        return await super.updateOne({id}, data)
    }
    
    async updateMany(data: UpdateQuery<K>, filter?: RootFilterQuery<K>): Promise<UpdateWriteOpResult> {
        return await super.updateMany(this._getFilter(filter), data)
    }
}