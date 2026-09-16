import { mongoose } from '@typegoose/typegoose'

export type Options = {
    key?: string
    defaultValue?: number
}

export const autoIncrementPlugin = (
    schema: mongoose.Schema,
    options: Options = {}
) => {
    const {
        key = 'id',
        defaultValue = 0
    } = options
    let value: number | undefined = undefined

    schema.statics.getMaxId = async function () {
        const doc = await this.findOne()
            .sort({ [key]: -1 })
            .select(key)
            .lean()
            .exec()

        return doc?.[key] ?? defaultValue
    }

    schema.pre(
        'save',
        async function () {
            if (!this.isNew) return

            if (value === undefined) {
                const model = this.constructor as any
                const id: number = await model.getMaxId()
                value = id
            }

            this[key] = ++value
        }
    )
}