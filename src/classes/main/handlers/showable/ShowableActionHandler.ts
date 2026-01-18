import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import CommandUtils from '../../../../utils/CommandUtils'
import Logging from '../../../../utils/Logging'
import { ContextOptions } from '../../../../utils/values/types/action-options'
import { BotFilterName, Contexts } from '../../../../utils/values/types/contexts'
import { AsyncOrSync, MaybeString, MyTelegraf } from '../../../../utils/values/types/types'
import ShowableBaseAction from '../../../actions/base/ShowableBaseAction'
import MapContainer from '../../containers/MapContainer'
import BaseHandler from '../BaseHandler'

export default abstract class <A extends ShowableBaseAction, F extends BotFilterName> extends BaseHandler<A, MapContainer<A>> {
    protected abstract _filterName: F
    protected abstract _notExistAction?: A
    protected abstract _nonCommandAction?: A
    protected abstract _hasntPremiumAction?: A
    
    protected abstract _createOptions(ctx: Contexts[F], other: MaybeString): AsyncOrSync<ContextOptions[F] | null>
    protected abstract _getText(ctx: Contexts[F]): string | undefined
    protected abstract _hasPremium(options: ContextOptions[F]): Promise<boolean>

    constructor() {
        super(new MapContainer())
    }

    protected _add(value: A): void {
        CommandDescriptionUtils.add(value.commandDescription)
        for (const name of [value.name, ...value.aliases]) {
            this._container.insert(name, value)
        }
    }

    protected _log(options: ContextOptions[F]) {
        Logging.log(`${this._filterName}`, {
            ...options,
            ctx: null
        })
    }

    async setup(bot: MyTelegraf): Promise<void> {
        bot.on(this._filterName, async ctx => {
            if (ctx.message.forward_origin) return
            const text = this._getText(ctx as any)
            if(!text) return

            await CommandUtils.doIfCommand(
                text,
                async ([_, command, other]) => {
                    const options = await this._createOptions(ctx as any, other)
                    if (!options) return
                    this._log(options)

                    if (!command) {
                        return this._nonCommandAction?.execute(options)
                    }

                    const instance = this._container.getByKey(command)
                    if (!instance) {
                        return this._notExistAction?.execute(options)
                    }

                    const hasPremium = await this._hasPremium(options)

                    if(!hasPremium && instance.isPremium) {
                        return await this._hasntPremiumAction?.execute(options)
                    }

                    await instance.execute(options)
                }
            )
        })
    }
}