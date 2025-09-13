import { Model, RootFilterQuery, UpdateQuery } from 'mongoose'
import BaseRepository from './BaseRepository'

export default class ChatIdRepository<T extends typeof Model, K extends {id: number, chatId: number}> extends BaseRepository<K, T> {
    async findOne(chatId: number, id: number, filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.findOne({...this._getFilter(filter), id, chatId})
    }

    async findManyInChat(chatId: number, filter?: RootFilterQuery<K>): Promise<K[]> {
        return await this.findMany({...filter, chatId})
    }

    async findMany(filter?: RootFilterQuery<K>): Promise<K[]> {
        return await super.findMany(this._getFilter(filter))
    }

    async deleteOne(chatId: number, id: number, filter?: RootFilterQuery<K>): Promise<K | null> {
        return await super.deleteOne({...this._getFilter(filter), id, chatId})
    }

    async updateOne(chatId: number, id: number, data: UpdateQuery<K>): Promise<K | null> {
        return await super.updateOne({chatId, id}, data)
    }
}