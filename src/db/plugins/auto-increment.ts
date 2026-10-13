import type { mongoose } from "@typegoose/typegoose"
import Logger from "../../utils/logs/Logger"

export type AutoIncrementOptions = {
    field?: string
    collection?: string
}

type Counter = {
    name: string
    sequence: number
}

type Document = mongoose.Document<unknown, {}, {
    [x: number]: unknown;
    [x: symbol]: unknown;
    [x: string]: unknown
}, {
    id: string
}, mongoose.DefaultSchemaOptions> & Omit<{
    [x: number]: unknown;
    [x: symbol]: unknown;
    [x: string]: unknown
} & Required<{
    _id: unknown
}> & {
    __v: number
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string
}>

const increment = async (
    document: Document,
    collection: string,
    field: string
) => {
    if (!document.isNew) return

    const name = document.collection.name
    const counter = document.db.collection<Counter>(collection)
    const result = await counter.findOneAndUpdate(
        {
            name
        },
        {
            $inc: {
                sequence: 1
            }
        },
        {
            returnDocument: 'after',
        }
    )

    Logger.debug(
        'autoIncrementPlugin',
        result
    )

    if (result) {
        document[field] = result.sequence
        return
    }

    const maxDocument = await document.collection
        .find()
        .sort({ [field]: -1 })
        .limit(1)
        .next()

    const nextValue = +(maxDocument?.[field] || 0) + 1

    Logger.debug(
        'autoIncrementPlugin',
        {
            maxDocument,
            nextValue
        }
    )

    await counter.insertOne({
        name,
        sequence: nextValue
    })
    document[field] = nextValue
}

export const autoIncrementPlugin = (
    schema: mongoose.Schema,
    { field = 'id', collection = 'counters' }: AutoIncrementOptions = {}
) => {
    schema.pre(
        'save',
        async function () {
            await increment(
                this,
                collection,
                field
            )
        }
    )
}