import AvaHistory from "../../../db/entities/user/AvaHistory"
import UserAvaService from "../../../db/services/user/UserAvaService"
import type { PhotoActionOptions } from "../../../types/action-options"
import type { PhotoActionExecuteResult } from "../../../types/results"
import RankUtils from "../../../utils/db/RankUtils"
import PhotoAction from "../base/PhotoAction"

export default class SetAvaPhotoAction extends PhotoAction {
    override aliases: string[] = ['аватарка', 'профиль']
    override minimumRank: number = RankUtils.min
    override name: string = 'ава'
    override filename: string = 'set-ava'
    override settingId: number = 82

    override async execute(options: PhotoActionOptions): Promise<PhotoActionExecuteResult> {
        const {
            chatId,
            id,
            highQualityPhoto
        } = options

        const fileId = highQualityPhoto.file_id
        await UserAvaService.set(chatId, id, new AvaHistory({ fileId }))

        return {
            key: 'profile/ava/change'
        }
    }
}