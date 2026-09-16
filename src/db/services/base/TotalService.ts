import { SettingValueTypes } from "../../../protos/settings_pb"
import ChatService from "../chat/ChatService"
import RuleService from "../chat/RuleService"
import DuelistService from "../duel/DuelistService"
import GameService from "../game/GameService"
import GreedBoxService from "../greed-box/GreedBoxService"
import SelectedGunService from "../gun/SelectedGunService"
import IdeaService from "../ideas/IdeaService"
import InventoryItemService from "../items/InventoryItemService"
import LevelService from "../level/LevelService"
import MessagesService from "../message/MessagesService"
import BalanceService from "../money/BalanceService"
import RouletteService from "../roulette/RouletteService"
import RoleplayService from "../rp/RoleplayService"
import SettingValueService from "../settings/SettingValueService"
import UserService from "../user/UserService"
import WorkService from "../work/WorkService"

type Service<T extends Record<string, any>> = {
    migrate(filter: T, value: T): Promise<any>
}

type ChatIdService = Service<{ chatId?: number }>
type IdService = Service<{ id?: number }>

export default class TotalService {
    static chatIdServices: ChatIdService[] = [
        BalanceService,
        DuelistService,
        GameService,
        GreedBoxService,
        InventoryItemService,
        LevelService,
        MessagesService,
        RouletteService,
        RuleService,
        SelectedGunService,
        UserService,
        WorkService
    ]

    static idServices: IdService[] = [
        ChatService,
        RoleplayService,
        IdeaService
    ]

    static async migrate(oldChatId: number, newChatId: number) {
        await Promise.all([
            ...this.chatIdServices.map(async service => {
                return await service.migrate({ chatId: oldChatId }, { chatId: newChatId })
            }),
            ...this.idServices.map(async service => {
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
}