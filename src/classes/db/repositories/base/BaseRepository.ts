import { Model, RootFilterQuery } from 'mongoose'

export default abstract class BaseRepository<K, T extends typeof Model<K>> {
    protected _Model: T

    constructor(Model: T) {
        this._Model = Model
    }

    protected _getFilter(filter?: RootFilterQuery<K>): RootFilterQuery<K> {
        return (filter ?? {})
    }

    async create(data: K): Promise<K> {
        const obj = new this._Model(data)
        await obj.save()

        return obj
    }

    async findOne(...filter: any): Promise<K | null> {
        return await this._Model.findOne(filter[0])
    }

    async findMany(...filter: any): Promise<K[]> {
        return await this._Model.find(filter[0] ?? {})
    }

    async deleteOne(...filter: any): Promise<K | null> {
        return await this._Model.findOneAndDelete(filter[0])
    }

    /**
     * first values must be filter, second must be data
     */

    async updateOne(...values: any): Promise<K | null> {
        return await this._Model.findOneAndUpdate(values[0], values[1])
    }
}