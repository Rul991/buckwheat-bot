import { model, ObtainDocumentType, Schema } from 'mongoose'

type ModelOptions<T> = {
    name: string,
    definition: ObtainDocumentType<T>
}

export const createModel = <Type>({name, definition}: ModelOptions<Type>) => {
    const schema = new Schema<Type>(definition)
    return model<Type>(name, schema)
}

export const createModelWithSubModel = <Type, SubType>(
    definition: ObtainDocumentType<SubType>,
    schemaCallback: (subModel: Schema<SubType>) => ModelOptions<Type>
) => {
    const subModel = new Schema<SubType>(definition)
    return createModel(schemaCallback(subModel))
}