import { model, Schema } from 'mongoose'
import Casino from '../../../interfaces/schemas/Casino'
import { START_MONEY } from '../../../utils/consts'

type Type = Casino

const casinoSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        loses: {type: Number, default: 0},
        wins: {type: Number, default: 0},
        money: {type: Number, default: START_MONEY}
    }
)

const CasinoModel = model<Type>('Casino', casinoSchema)

export default CasinoModel