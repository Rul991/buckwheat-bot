import { model, ObtainDocumentType, Schema, SchemaDefinition } from 'mongoose'

type ModelOptions<T> = {
    name: string,
    definition: SchemaDefinition<T>
}

export const createModel = <Type>({name, definition}: ModelOptions<Type>) => {
    const schema = new Schema<Type>(definition)
    return model<Schema<Type>>(name, schema)
}

export const createModelWithSubModel = <Type, SubType>(
    definition: SchemaDefinition<SubType>,
    schemaCallback: (subSchema: Schema<SubType>) => ModelOptions<Type>
) => {
    const subSchema = new Schema<SubType>(definition)
    return createModel(schemaCallback(subSchema))
}