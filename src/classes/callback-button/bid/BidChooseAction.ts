import { JSONSchemaType } from 'ajv'
import { CallbackButtonContext } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'

type Data = UserReplyIdsData & {
    
}

export default class BidChooseAction extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = userReplyIdsDataSchema
    
    constructor() {
        super()
        this._name = 'bidchoose'
    }

    async execute(ctx: CallbackButtonContext, {user, reply}: Data): Promise<string | void> {
        
    }
}