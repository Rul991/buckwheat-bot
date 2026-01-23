import { Context } from 'telegraf'
import CommandUtils from '../../../../../utils/CommandUtils'
import FileUtils from '../../../../../utils/FileUtils'
import MessageUtils from '../../../../../utils/MessageUtils'
import RankUtils from '../../../../../utils/RankUtils'
import { COMMAND_ACCESS_TYPE } from '../../../../../utils/values/consts'
import { MaybeString } from '../../../../../utils/values/types/types'
import UserRankService from '../../user/UserRankService'
import BaseSubSettingsService from '../BaseSubSettingsService'
import RankSettingsService from '../RankSettingsService'
import SettingUtils from '../../../../../utils/settings/SettingUtils'

type CheckRankOptions = {
    ctx: Context
    settingId: string
    chatId: number
    id: number
    command: {
        command: MaybeString
        isFull?: boolean
    }
    path?: string
    info?: (ctx: Context, text: string) => Promise<void>
}

export default class extends BaseSubSettingsService {
    constructor (filename?: string) {
        super(filename ?? COMMAND_ACCESS_TYPE)
    }

    async canUse({
        ctx,
        settingId,
        chatId,
        id,
        command: {
            command,
            isFull = false
        },
        path = 'text/handlers/showable/low-rank.pug',
        info = async (ctx, text) => {
            await MessageUtils.answer(
                ctx,
                text
            )
        }
    }: CheckRankOptions) {
        const canUseWithoutRank = await RankUtils.canUseWithoutRank(ctx, id)
        if (!canUseWithoutRank) {
            const needRank: number = await this.get<'enum'>(
                chatId,
                settingId
            ) as number

            if(needRank.toString() == SettingUtils.dummyDefault) {
                return true
            }

            const userRank = await UserRankService.get(chatId, id)

            const getRankValues = async (rank: number) => ({
                name: await RankSettingsService.get<'string'>(chatId, `rank-${rank}`),
                value: rank,
                emoji: RankUtils.getEmojiByRank(rank)
            })

            if (!RankUtils.has(userRank, needRank)) {
                const text = await FileUtils.readPugFromResource(
                    path,
                    {
                        changeValues: {
                            needRank: await getRankValues(needRank),
                            userRank: await getRankValues(userRank),
                            command: isFull ? command : CommandUtils.getFullCommand(command!)
                        }
                    }
                )

                await info(ctx, text)
                return false
            }
        }

        return true
    }
}