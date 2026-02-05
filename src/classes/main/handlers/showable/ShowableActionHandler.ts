import Setting from '../../../../interfaces/other/Setting'
import CommandDescriptionUtils from '../../../../utils/CommandDescriptionUtils'
import CommandUtils from '../../../../utils/CommandUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import Logging from '../../../../utils/Logging'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import { COMMAND_ACCESS_TYPE, DEV_ID } from '../../../../utils/values/consts'
import { ContextOptions } from '../../../../utils/values/types/action-options'
import { BotFilterName, Contexts } from '../../../../utils/values/types/contexts'
import { AsyncOrSync, MaybeString, MyTelegraf } from '../../../../utils/values/types/types'
import ShowableBaseAction from '../../../actions/base/ShowableBaseAction'
import CommandAccessService from '../../../db/services/settings/access/CommandAccessService'
import RankSettingsService from '../../../db/services/settings/RankSettingsService'
import UserRankService from '../../../db/services/user/UserRankService'
import MapContainer from '../../containers/MapContainer'
import BaseHandler from '../BaseHandler'

type OptionsAndCommand<F extends BotFilterName> = {
    options: ContextOptions[F]
    command: MaybeString
}

export default abstract class <A extends ShowableBaseAction, F extends BotFilterName> extends BaseHandler<A, MapContainer<A>> {
    protected abstract _filterName: F
    protected abstract _notExistAction?: A
    protected abstract _nonCommandAction?: A
    protected abstract _hasntPremiumAction?: A

    protected abstract _createOptions(ctx: Contexts[F], other: MaybeString): AsyncOrSync<ContextOptions[F] | null>
    protected abstract _getText(ctx: Contexts[F]): string | undefined
    protected abstract _hasPremium(options: ContextOptions[F]): Promise<boolean>

    constructor () {
        super(new MapContainer())
    }

    protected _add(value: A): void {
        CommandDescriptionUtils.add(value.commandDescription)
        for (const name of [value.name, ...value.aliases]) {
            this._container.insert(name, value)
        }
    }

    protected _log(options: ContextOptions[F]) {
        Logging.system(`${this._filterName}`, {
            ...options,
            ctx: null
        })
    }

    protected _setupSettings() {
        const settings = {} as Record<string, Setting<'enum'>>

        for (const action of this._container) {
            const actionSettings = action.actionAccesses
            for (const actionSetting of actionSettings) {
                const { name, setting } = actionSetting
                settings[name] = setting
            }
        }

        SettingUtils.addSettings(COMMAND_ACCESS_TYPE, settings)
    }

    async setup(bot: MyTelegraf): Promise<void> {
        this._setupSettings()
        bot.on(this._filterName, async ctx => {
            if (ctx.message.forward_origin) return
            const text = this._getText(ctx as any)
            if (!text) return

            await CommandUtils.doIfCommand(
                text,
                async ([_, command, other]) => {
                    const options = await this._createOptions(ctx as any, other)
                    if (!options) return
                    this._log(options)

                    if (!command) {
                        this._nonCommandAction?.execute(options)
                        return
                    }

                    const instance = this._container.getByKey(command)
                    if (!instance) {
                        return await this._notExistAction?.execute(options)
                    }

                    const hasPremium = await this._hasPremium(options)
                    if (!hasPremium && instance.isPremium) {
                        return await this._hasntPremiumAction?.execute(options)
                    }

                    const {
                        id,
                        chatId,
                    } = options

                    const canUse = await CommandAccessService.canUse({
                        chatId,
                        id,
                        command: {
                            command,
                        },
                        settingId: instance.settingId,
                        ctx: ctx as any
                    })
                    if(!canUse) return

                    await instance.execute(options)
                }
            )
        })
    }
}