import { getModelForClass, mongoose, type ReturnModelType } from "@typegoose/typegoose"
import type { AnyParamConstructor } from "@typegoose/typegoose/lib/types"
import type { RepoExtends } from "../../../types/types"
import type { ObjOrCallback } from "../../../types/callbacks"

type Filter<T extends AnyParamConstructor<any>> = Partial<InstanceType<T>>
type Result<T extends AnyParamConstructor<any>> = InstanceType<T> & { _id: mongoose.ObjectId }

export default class BaseRepository<T extends RepoExtends> {
    public model: ReturnModelType<T>

    constructor(obj: T) {
        this.model = getModelForClass(obj)
    }

    async updateOne(filter: Filter<T>, value: Filter<T>): Promise<Result<T> | undefined> {
        return (await this.model.findOneAndUpdate(
            filter,
            value,
            {
                returnDocument: 'after',
                upsert: true
            }
        ).lean().exec()) as Result<T> | undefined
    }

    async updateMany(filter: Filter<T>, value: Filter<T>) {
        return (await this.model.updateMany(
            filter,
            value
        ).lean().exec())
    }

    async find(filter?: Filter<T>): Promise<Result<T>[]> {
        const result = await this.model.find(filter)
            .lean()
            .exec()
        return result
    }

    async findOne(filter: Filter<T>): Promise<Result<T> | undefined> {
        return (await this.model.findOne(
            filter
        ).exec())?.toObject()
    }

    async create(obj: InstanceType<T>): Promise<Result<T>> {
        const created = await this.model
            .create(obj)

        return created.toObject()
    }

    async getOrCreate(filter: Filter<T>, objOrCallback: ObjOrCallback<InstanceType<T>>): Promise<Result<T>> {
        const found = await this.findOne(filter)

        if (found) {
            return found
        }
        else {
            const obj: InstanceType<T> = typeof objOrCallback == 'function' ?
                await (objOrCallback as () => InstanceType<T> | Promise<InstanceType<T>>)() :
                objOrCallback
            return await this.create(obj)
        }
    }

    async updateOrCreate(filter: Filter<T>, obj: InstanceType<T>): Promise<InstanceType<T> & { new?: true }> {
        const found = await this.findOne(filter)
        if (!found) {
            return {
                ...await this.create(obj),
                new: true
            }
        }

        return (await this.updateOne(
            filter,
            obj
        ))!
    }

    async updateOrCreateMany(filter: Filter<T>, arr: InstanceType<T>[]) {
        return await this.model.bulkWrite(
            arr.map(v => {
                return {
                    updateOne: {
                        filter,
                        update: { $set: v },
                        upsert: true
                    }
                }
            })
        )
    }

    async deleteOne(filter: Filter<T>) {
        return await this.model.deleteOne(
            filter
        ).exec()
    }

    async count(filter?: Filter<T>): Promise<number> {
        return await this.model.countDocuments(filter).lean().exec()
    }
}