import { model, Schema } from 'mongoose'
import User from '../../../interfaces/schemas/User'

type Type = User

const userSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        description: {type: String, default: ''},
        name: {type: String, required: true},
        rank: {type: Number, default: 0},
    }
)

const UserModel = model<Type>('User', userSchema)

export default UserModel