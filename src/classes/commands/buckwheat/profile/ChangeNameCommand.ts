import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import { DEFAULT_USER_NAME, MAX_NAME_LENGTH } from '../../../../utils/values/consts'
import UserNameService from '../../../db/services/user/UserNameService'
import MessageUtils from '../../../../utils/MessageUtils'

export default class ChangeNameCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'ник'
        this._description = 'показываю или меняю вам имя в беседе'
        this._needData = true
        this._argumentText = 'имя'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const {id} = ctx.from
        const link = ContextUtils.getLinkUrl(id)

        if(!other) {
            const name = await UserNameService.get(id) ?? DEFAULT_USER_NAME

            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/change-name/name.pug', 
                {changeValues: {link, name}}
            )
        }

        else {
            const name = other
            const names = await UserNameService.getAll()

            if(names.includes(name)) {
                await MessageUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-name/exist.pug', 
                    {
                        changeValues: {
                            name
                        }
                    }
                )
                return
            }

            if(name.length > MAX_NAME_LENGTH) {
                await MessageUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/change-name/big-name.pug', 
                    {changeValues: {max: MAX_NAME_LENGTH.toString()}}
                )
                return
            }
            
            await UserNameService.update(id, name)
            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/change-name/changed.pug', 
                {
                    changeValues: {link, name}
                }
            )
        }
    }
}