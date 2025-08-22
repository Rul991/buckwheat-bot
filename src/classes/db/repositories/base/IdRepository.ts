import { Model, RootFilterQuery } from 'mongoose'
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

    async updateOne(id: number, data: Partial<K>): Promise<K | null> {
        return await super.updateOne({id}, data)
    }
}