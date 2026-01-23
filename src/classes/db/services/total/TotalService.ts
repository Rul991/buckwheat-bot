import AwardsRepository from '../../repositories/AwardsRepository'
import ChatIdRepository from '../../repositories/base/ChatIdRepository'
import CardsRepository from '../../repositories/CardsRepository'
import CasinoRepository from '../../repositories/CasinoRepository'
import ChosenSkillsRepository from '../../repositories/ChosenSkillsRepository'
import CubeRepository from '../../repositories/CubeRepository'
import DuelistRepository from '../../repositories/DuelistRepository'
import GeneratorsRepository from '../../repositories/GeneratorsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'
import LevelRepository from '../../repositories/LevelRepository'
import MarriageRepository from '../../repositories/MarriageRepository'
import MessagesRepository from '../../repositories/MessagesRepository'
import RouletteRepository from '../../repositories/RouletteRepository'
import SettingsRepository from '../../repositories/SettingsRepository'
import UserRepository from '../../repositories/UserRepository'
import WorkRepository from '../../repositories/WorkRepository'
import ShopCardService from '../card/ShopCardService'
import CasinoWipeService from '../casino/CasinoWipeService'
import ChatService from '../chat/ChatService'
import GeneratorsService from '../generators/GeneratorsService'
import ItemsService from '../items/ItemsService'
import LevelService from '../level/LevelService'
import RoleplaysService from '../rp/RoleplaysService'
import WorkService from '../work/WorkService'

export default class {
    static async deleteChat(chatId: number) {
        const repos: ChatIdRepository<any, any>[] = [
            AwardsRepository,
            CasinoRepository,
            ChosenSkillsRepository,
            CubeRepository,
            DuelistRepository,
            ItemsRepository,
            LevelRepository,
            GeneratorsRepository,
            MarriageRepository,
            MessagesRepository,
            RouletteRepository,
            CardsRepository,
            UserRepository,
            WorkRepository
        ]

        return await Promise.allSettled([
            ...repos.map(repo => repo.deleteAllInChat(chatId)),
            ChatService.delete(chatId),
            SettingsRepository.deleteMany({ id: chatId }),
            RoleplaysService.deleteAll(chatId),
            ShopCardService.deleteAllInChat(chatId)
        ])
    }

    static async wipe(chatId: number) {
        return await Promise.allSettled([
            LevelService.wipe(chatId),
            ItemsService.wipe(chatId),
            WorkService.wipe(chatId),
            CasinoWipeService.money(chatId),
            GeneratorsService.wipe(chatId),
        ])
    }
}