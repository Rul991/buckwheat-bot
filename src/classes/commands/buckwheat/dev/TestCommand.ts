import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import { DEV_ID } from '../../../../utils/values/consts'
import UserProfileService from '../../../db/services/user/UserProfileService'
import UserLeftService from '../../../db/services/user/UserLeftService'

export default class TestCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'тест'
        this._isShow = false
    }

    private async _secretFunction(ctx: TextContext, other: MaybeString) {
        const users = await UserProfileService.getAll()
        const update = async (id: number, isLeft: boolean) => {
            await UserLeftService.update(id, isLeft)
        }

        for await (const {id} of users) {
            try {
                const member = await ctx.telegram.getChatMember(ctx.chat.id, id)
                if(id == 5248856687) {
                    console.log(member)
                }
                await update(id, member.status == 'left' || member.status == 'kicked')
            }
            catch {
                await update(id, true)
            }
        }
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(DEV_ID && ctx.from.id == +DEV_ID) {
            this._secretFunction(ctx, other)
        }

        await MessageUtils.answerMessageFromResource(ctx, 
            'text/commands/other/test.pug',
            {
                changeValues: {other: other ?? ''}
            }
        )
    }
}