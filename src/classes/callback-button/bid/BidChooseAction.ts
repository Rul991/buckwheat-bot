import { ZodType } from 'zod'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = UserReplyIdsData & {
    
}

export default class BidChooseAction extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = userReplyIdsDataSchema
    
    constructor() {
        super()
        this._name = 'bidchoose'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        
    }
}