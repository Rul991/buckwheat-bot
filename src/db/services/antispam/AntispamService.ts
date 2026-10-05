import { NO_ANTISPAM_MESSAGE_COUNT } from "../../../consts/number"
import { antispamMessageSetting, antispamPeriodSetting } from "../../../resources/settings/chat"
import Logger from "../../../utils/logs/Logger"
import TimeUtils from "../../../utils/time/TimeUtils"
import Antispam from "../../entities/antispam/Antispam"
import BaseService from "../base/BaseService"
import SettingValueService from "../settings/SettingValueService"

class AntispamService extends BaseService<typeof Antispam> {
    constructor() {
        super(Antispam)
    }

    async add(id: number) {
        const found = await this._repo.findOne({
            id
        })

        if (found) {
            return await this._repo.updateOne(
                {
                    id
                },
                {
                    $inc: {
                        messages: 1
                    }
                }
            )
        }

        return await this.create(
            new Antispam({
                id
            })
        )
    }

    async addAndCheck(chatId: number, id: number): Promise<boolean> {
        const antispam = await this.add(id)
        const notSpamTimeSettingValue = await SettingValueService.get({
            id: chatId,
            setting: antispamPeriodSetting
        })
        const notSpamTime = notSpamTimeSettingValue.value

        const isExpired = TimeUtils.isExpired(
            +(antispam?.createdAt ?? new Date()),
            notSpamTime
        )

        Logger.debug(
            'AntispamService.addAndCheck',
            {
                antispam,
                notSpamTimeSettingValue,
                notSpamTime,
                isExpired,
                chatId,
                id,
            }
        )

        if (isExpired) {
            await this._repo.deleteOne({ id })
            return false
        }

        const maxMessagesSettingValue = await SettingValueService.get({
            id: chatId,
            setting: antispamMessageSetting
        })
        const maxMessages = maxMessagesSettingValue.value

        const messages = antispam?.messages ?? NO_ANTISPAM_MESSAGE_COUNT
        return maxMessages > NO_ANTISPAM_MESSAGE_COUNT && messages >= maxMessages
    }
}

export default new AntispamService()