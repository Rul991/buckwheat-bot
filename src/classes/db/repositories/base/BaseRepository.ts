import { Model, RootFilterQuery, UpdateWriteOpResult } from 'mongoose'
import { FIRST_INDEX } from '../../../../utils/values/consts'

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

    async findByFilter(filter: RootFilterQuery<K>): Promise<K | null> {
        return await this._Model.findOne(filter).exec()
    }

    async findOne(...filter: any): Promise<K | null> {
        return await this.findByFilter(filter[FIRST_INDEX])
    }

    async findMany(...filter: any): Promise<K[]> {
        return await this._Model.find(filter[FIRST_INDEX] ?? {}).exec()
    }

    async deleteOne(...filter: any): Promise<K | null> {
        return await this._Model.findOneAndDelete(filter[FIRST_INDEX]).exec()
    }

    /**
     * first values must be filter, second must be data
     */

    async updateOne(...values: any): Promise<K | null> {
        return await this._Model.findOneAndUpdate(
            values[FIRST_INDEX], 
            values[1],
            {
                upsert: true
            }
        ).exec()
    }

    /**
     * first values must be filter, second must be data
     */

    async getOrCreate(...values: any): Promise<K> {
        const found = await this.findByFilter(this._getFilter(values[0]))
        if(found) return found

        return this.create(values[1])
    }

    /**
     * first argument is filter
     * 
     * second argument is update query
     */

    async updateMany(...values: any): Promise<UpdateWriteOpResult> {
        return await this._Model.updateMany(values[FIRST_INDEX], values[1]).exec()
    }
}