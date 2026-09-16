import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { GunSetButtonDataSchema, type GunSetButtonData } from "../../../../protos/gun_pb"
import ItemUtils from "../../../../utils/items/ItemUtils"
import SelectedGunService from "../../../../db/services/gun/SelectedGunService"

class GunSetButton extends CallbackQueryAction<GunSetButtonData> {
    override schema: GenMessage<GunSetButtonData> = GunSetButtonDataSchema
    override defaultTextKey: string = 'gun/button/set'
    override minimumRank: number = RankUtils.min
    override settingId: number = 91
    override name: string = 'gunset'

    protected override async _getId(options: CallbackQueryActionOptions<GunSetButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<GunSetButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        const {
            itemId
        } = data

        const item = ItemUtils.get(itemId)
        if(!item) {
            return {
                key: 'inventory/not-exist',
                vars: {
                    totally: true
                }
            }
        }

        await SelectedGunService.set(
            chatId,
            id,
            item
        )

        return {
            key: 'gun/changed',
            vars: {
                item: item.getVars(ctx)
            }
        }
    }
}

export default new GunSetButton()