import { model, Schema } from 'mongoose'
import Casino from '../../../interfaces/schemas/Casino'
import { DAILY_MONEY } from '../../../utils/consts'

type Type = Casino

const casinoSchema = new Schema<Type>(
    {
        id: {type: Number, required: true, unique: true},
        lastDeposite: {type: Number, default: 0},
        loses: {type: Number, default: 0},
        wins: {type: Number, default: 0},
        money: {type: Number, default: DAILY_MONEY}
    }
)

const CasinoModel = model<Type>('Casino', casinoSchema)

export default CasinoModel