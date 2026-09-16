import { DEV_ID, IS_PROD } from "../../../../../consts/env"
import { greedBoxItem } from "../../../../../resources/items/inventory"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ShopUtils from "../../../../../utils/items/ShopUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class DevCommand extends BuckwheatCommand {
    override name: string = 'дев'
    override aliases: string[] = []
    override minimumRank: number = 0
    override isShow: boolean = false
    override settingId: number = 10
    override filename: string = ''

    private async _dev(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        const item = greedBoxItem
        return await ShopUtils.message({
            ctx,
            item,
            count: 100,
            page: 0,
            index: 0
        })
    }

    private async _prod(_options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        return {
            key: 'dev/todo'
        }
    }

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id
        } = options
        if (IS_PROD && id != DEV_ID) {
            return this._prod(options)
        }

        return this._dev(options)
    }
}