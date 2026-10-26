import type { QueryFilter } from "mongoose"
import { SettingValueTypes } from "../../../protos/settings_pb"
import ChatService from "../chat/ChatService"
import RuleService from "../chat/RuleService"
import DuelistService from "../duel/DuelistService"
import GameService from "../game/GameService"
import GeneratorService from "../generator/GeneratorService"
import GreedBoxService from "../greed-box/GreedBoxService"
import SelectedGunService from "../gun/SelectedGunService"
import InventoryItemService from "../items/InventoryItemService"
import LevelService from "../level/LevelService"
import MarketSlotService from "../market/MarketSlotService"
import MessagesService from "../message/MessagesService"
import BalanceService from "../money/BalanceService"
import RouletteService from "../roulette/RouletteService"
import RoleplayService from "../rp/RoleplayService"
import SettingValueService from "../settings/SettingValueService"
import UserService from "../user/UserService"
import WorkService from "../work/WorkService"
import AwardService from "../award/AwardService"
import DonateService from "../donate/DonateService"
import MarriageService from "../marriage/MarriageService"

type Service<T extends Record<string, any>> = {
    migrate(filter: T, value: T): Promise<unknown>
    deleteOne(filter: T): Promise<unknown>
    deleteMany(filter: T): Promise<unknown>
}

type ChatIdService = Service<{ chatId: number }>
type IdService = Service<{ id: number }>
type ChatIdAndIdService = Service<QueryFilter<{ chatId: number, id: number }>>

export default class TotalService {
    static readonly migrateChatIdServices: ChatIdService[] = [
        AwardService,
        BalanceService,
        DonateService,
        DuelistService,
        GameService,
        GeneratorService,
        GreedBoxService,
        InventoryItemService,
        LevelService,
        MarketSlotService,
        MarriageService,
        MessagesService,
        RouletteService,
        RuleService,
        SelectedGunService,
        UserService,
        WorkService
    ]

    static readonly migrateIdServices: IdService[] = [
        ChatService,
        RoleplayService,
    ]

    static readonly wipeServices: ChatIdService[] = [
        BalanceService,
        LevelService,
        WorkService,
        GeneratorService,
        MarketSlotService,
        GreedBoxService,
    ]

    static readonly deleteChatIdAndIdServices: ChatIdAndIdService[] = [
        AwardService,
        BalanceService,
        DuelistService,
        GameService,
        GeneratorService,
        GreedBoxService,
        InventoryItemService,
        LevelService,
        MarketSlotService,
        MessagesService,
        RouletteService,
        RuleService,
        SelectedGunService,
        UserService,
        WorkService
    ]

    static async migrate(oldChatId: number, newChatId: number) {
        await Promise.all([
            ...this.migrateChatIdServices.map(async service => {
                return await service.migrate({ chatId: oldChatId }, { chatId: newChatId })
            }),
            ...this.migrateIdServices.map(async service => {
                return await service.migrate({ id: oldChatId }, { id: newChatId })
            }),
            SettingValueService.migrate(
                {
                    id: oldChatId,
                    valueType: SettingValueTypes.Button
                },
                {
                    id: newChatId
                }
            ),
            SettingValueService.migrate(
                {
                    id: oldChatId,
                    valueType: SettingValueTypes.Chat
                },
                {
                    id: newChatId
                }
            ),
            SettingValueService.migrate(
                {
                    id: oldChatId,
                    valueType: SettingValueTypes.Command
                },
                {
                    id: newChatId
                }
            ),
            SettingValueService.migrate(
                {
                    id: oldChatId,
                    valueType: SettingValueTypes.Ranks
                },
                {
                    id: newChatId
                }
            ),

        ])
    }

    static async wipe(chatId: number) {
        await Promise.all([
            ...this.wipeServices.map(
                service => {
                    return service.deleteMany({ chatId })
                }
            ),
            InventoryItemService.wipe(chatId)
        ])

    }

    static async deleteUser(chatId: number, id: number) {
        return await Promise.all([
            ...this.deleteChatIdAndIdServices.map(async v => {
                return v.deleteOne({ chatId, id })
            }),
        ])
    }

    static async deleteUnactiveUsers(chatId: number, meId: number) {
        const users = await MessagesService.getTotalUnactiveUsers(chatId, meId)
        const ids = users
            .map(v => v.id)
            .filter(v => v != meId)

        return await Promise.all([
            ...this.deleteChatIdAndIdServices.map(async v => {
                return v.deleteMany({
                    chatId,
                    id: {
                        $in: ids
                    }
                })
            })
        ])
    }
}