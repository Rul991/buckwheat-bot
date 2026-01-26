import { readdir } from 'fs/promises'
import mongoose, { disconnect } from 'mongoose'
import { join } from 'path'
import AddProfileAction from '../classes/actions/every/AddProfileAction'
import AntiSpamAction from '../classes/actions/every/AntiSpamAction'
import NewMessagesAction from '../classes/actions/every/NewMessagesAction'
import NotAllowedChatAction from '../classes/actions/every/NotAllowedChatAction'
import RandomPrizeMessageAction from '../classes/actions/every/RandomPrizeMessageAction'
import ReactionAction from '../classes/actions/every/ReactionAction'
import WrongChatAction from '../classes/actions/every/WrongChatAction'
import AddLeftInDatabaseAction from '../classes/actions/left-member/AddLeftInDatabaseAction'
import CheckDeletingFromChatAction from '../classes/actions/my-chat-member/CheckDeletingFromChatAction'
import AddInDatabaseAction from '../classes/actions/new-member/AddInDatabaseAction'
import HelloMemberAction from '../classes/actions/new-member/HelloMemberAction'
import DebtMemberAction from '../classes/actions/new-member/ReturnMemberAction'
import DonateAction from '../classes/actions/payment/DonateAction'
import SubscriptionAction from '../classes/actions/payment/SubscriptionAction'
import ImageProfileAction from '../classes/actions/photo/ImageProfileAction'
import CardPriceSellAction from '../classes/actions/scenes/CardPriceSellAction'
import ImportSceneAction from '../classes/actions/scenes/ImportSceneAction'
import SettingNumberAction from '../classes/actions/scenes/setting-input/SettingNumberAction'
import SettingStringAction from '../classes/actions/scenes/setting-input/SettingStringAction'
import SuggestCardAction from '../classes/actions/scenes/SuggestCardAction'
import CardChangeAction from '../classes/callback-button/card/menu/CardChangeAction'
import CardShopAction from '../classes/callback-button/card/menu/CardShopAction'
import CardStatsAction from '../classes/callback-button/card/menu/CardStatsAction'
import UnpackCardAction from '../classes/callback-button/card/menu/UnpackCardAction'
import CardBuyAction from '../classes/callback-button/card/shop/buy/CardBuyAction'
import CardBuyChangeAction from '../classes/callback-button/card/shop/buy/CardBuyChangeAction'
import CardBuyShowAction from '../classes/callback-button/card/shop/buy/CardBuyShowAction'
import CardSellAction from '../classes/callback-button/card/shop/sell/CardSellAction'
import CardSellChangeAction from '../classes/callback-button/card/shop/sell/CardSellChangeAction'
import SuggestCardEnterAction from '../classes/callback-button/card/suggest/SuggestCardEnterAction'
import SuggestedCardAddAction from '../classes/callback-button/card/suggest/SuggestedCardAddAction'
import SuggestedCardChangeAction from '../classes/callback-button/card/suggest/SuggestedCardChangeAction'
import ClassAction from '../classes/callback-button/ClassAction'
import CubeNoAction from '../classes/callback-button/cube/CubeNoAction'
import CubeYesAction from '../classes/callback-button/cube/CubeYesAction'
import ExportAction from '../classes/callback-button/data/ExportAction'
import ImportAction from '../classes/callback-button/data/ImportAction'
import DeleteMessageAction from '../classes/callback-button/DeleteMessageAction'
import DuelAwayAction from '../classes/callback-button/duels/DuelAwayAction'
import DuelEffectsAction from '../classes/callback-button/duels/DuelEffectsAction'
import DuelFightAction from '../classes/callback-button/duels/DuelFightAction'
import DuelNoAction from '../classes/callback-button/duels/DuelNoAction'
import DuelSkillAction from '../classes/callback-button/duels/DuelSkillAction'
import DuelStartAction from '../classes/callback-button/duels/DuelStartAction'
import DuelYesAction from '../classes/callback-button/duels/DuelYesAction'
import SkillUseAction from '../classes/callback-button/duels/SkillUseAction'
import EffectChangeAction from '../classes/callback-button/effects/EffectChangeAction'
import FaqAction from '../classes/callback-button/faq/FaqAction'
import FaqChangeAction from '../classes/callback-button/faq/FaqChangeAction'
import GeneratorAddAction from '../classes/callback-button/generator/GeneratorAddAction'
import GeneratorChangeAction from '../classes/callback-button/generator/GeneratorChangeAction'
import GeneratorCollectAction from '../classes/callback-button/generator/GeneratorCollectAction'
import GeneratorShowAction from '../classes/callback-button/generator/GeneratorShowAction'
import GeneratorUpgradeAction from '../classes/callback-button/generator/GeneratorUpgradeAction'
import DeleteIdeaAction from '../classes/callback-button/ideas/DeleteIdeaAction'
import IdeaChangeAction from '../classes/callback-button/ideas/IdeaChangeAction'
import VoteAction from '../classes/callback-button/ideas/VoteAction'
import InventoryChangeAction from '../classes/callback-button/inventory/InventoryChangeAction'
import InventoryShowAction from '../classes/callback-button/inventory/InventoryShowAction'
import MarketBuyChangeAction from '../classes/callback-button/market/buy/MarketBuyChangeAction'
import MarryNoAction from '../classes/callback-button/marry/MarryNoAction'
import MarryYesAction from '../classes/callback-button/marry/MarryYesAction'
import RandomPrizeButtonAction from '../classes/callback-button/RandomPrizeButtonAction'
import AwardsChangeAction from '../classes/callback-button/scrollers/page/AwardsChangeAction'
import CommandsChangeAction from '../classes/callback-button/scrollers/page/CommandsChangeAction'
import RoleplayChangeAction from '../classes/callback-button/scrollers/page/RoleplayChangeAction'
import RuleChangeAction from '../classes/callback-button/scrollers/page/RuleChangeAction'
import SettingsChangeAction from '../classes/callback-button/settings/SettingsChangeAction'
import SettingSetAction from '../classes/callback-button/settings/SettingSetAction'
import SettingsShowAction from '../classes/callback-button/settings/SettingsShowAction'
import BuyAction from '../classes/callback-button/shop/BuyAction'
import ItemChangeAction from '../classes/callback-button/shop/ItemChangeAction'
import ItemShowAction from '../classes/callback-button/shop/ItemShowAction'
import SkillAddAction from '../classes/callback-button/skills/SkillAddAction'
import SkillAlertAction from '../classes/callback-button/skills/SkillAlertAction'
import SkillChangeAction from '../classes/callback-button/skills/SkillChangeAction'
import SkillMenuAction from '../classes/callback-button/skills/SkillMenuAction'
import SkillRemoveAction from '../classes/callback-button/skills/SkillRemoveAction'
import SkillViewAction from '../classes/callback-button/skills/SkillViewAction'
import TestAction from '../classes/callback-button/TestAction'
import TopChangeAction from '../classes/callback-button/top/TopChangeAction'
import VerificationAction from '../classes/callback-button/VerificationAction'
import WipeAction from '../classes/callback-button/WipeAction'
import AddAwardCommand from '../classes/commands/award/AddAwardCommand'
import GetAwardCommand from '../classes/commands/award/GetAwardCommand'
import SimpleBuckwheatCommand from '../classes/commands/base/SimpleBuckwheatCommand'
import BanCommand from '../classes/commands/buckwheat/admins/BanCommand'
import CreatorCommand from '../classes/commands/buckwheat/admins/CreatorCommand'
import DeleteCommand from '../classes/commands/buckwheat/admins/DeleteCommand'
import MuteCommand from '../classes/commands/buckwheat/admins/MuteCommand'
import PinCommand from '../classes/commands/buckwheat/admins/PinCommand'
import RankCommand from '../classes/commands/buckwheat/admins/RankCommand'
import SummonCommand from '../classes/commands/buckwheat/admins/SummonCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import UnmuteCommand from '../classes/commands/buckwheat/admins/UnmuteCommand'
import UnpinCommand from '../classes/commands/buckwheat/admins/UnpinCommand'
import WipeCommand from '../classes/commands/buckwheat/admins/WipeCommand'
import CardCommand from '../classes/commands/buckwheat/card/CardCommand'
import ChatCommand from '../classes/commands/buckwheat/chat/ChatCommand'
import HelloCommand from '../classes/commands/buckwheat/chat/HelloCommand'
import PremiumCommand from '../classes/commands/buckwheat/chat/PremiumCommand'
import RuleCommand from '../classes/commands/buckwheat/chat/RuleCommand'
import ExportCommand from '../classes/commands/buckwheat/data/ExportCommand'
import ImportCommand from '../classes/commands/buckwheat/data/ImportCommand'
import BroadcastCommand from '../classes/commands/buckwheat/dev/BroadcastCommand'
import TestCommand from '../classes/commands/buckwheat/dev/TestCommand'
import UpdateCommand from '../classes/commands/buckwheat/dev/UpdateCommand'
import CharsCommand from '../classes/commands/buckwheat/duel/CharsCommand'
import EffectsCommand from '../classes/commands/buckwheat/duel/EffectsCommand'
import SaveCommand from '../classes/commands/buckwheat/duel/SaveCommand'
import SkillsCommand from '../classes/commands/buckwheat/duel/SkillsCommand'
import DonateCommand from '../classes/commands/buckwheat/fee/DonateCommand'
import ChooseCommand from '../classes/commands/buckwheat/game/ChooseCommand'
import CookieCommand from '../classes/commands/buckwheat/game/CookieCommand'
import InfoCommand from '../classes/commands/buckwheat/game/InfoCommand'
import MoneyDropCommand from '../classes/commands/buckwheat/game/MoneyDropCommand'
import RoleplayCommand from '../classes/commands/buckwheat/game/RoleplayCommand'
import RouletteCommand from '../classes/commands/buckwheat/game/RouletteCommand'
import CommandsCommand from '../classes/commands/buckwheat/info/CommandsCommand'
import FaqCommand from '../classes/commands/buckwheat/info/FaqCommand'
import IdeaCommand from '../classes/commands/buckwheat/info/IdeaCommand'
import InventoryCommand from '../classes/commands/buckwheat/info/InventoryCommand'
import StatsCommand from '../classes/commands/buckwheat/info/StatsCommand'
import ExperienceCommand from '../classes/commands/buckwheat/level/ExperienceCommand'
import LevelCommand from '../classes/commands/buckwheat/level/LevelCommand'
import DivorceCommand from '../classes/commands/buckwheat/marriage/DivorceCommand'
import MarriageCommand from '../classes/commands/buckwheat/marriage/MarriageCommand'
import MarryCommand from '../classes/commands/buckwheat/marriage/MarryCommand'
import BalanceCommand from '../classes/commands/buckwheat/money/BalanceCommand'
import CubeCommand from '../classes/commands/buckwheat/money/CubeCommand'
import GeneratorCommand from '../classes/commands/buckwheat/money/GeneratorCommand'
import GreedBoxCommand from '../classes/commands/buckwheat/money/GreedBoxCommand'
import ShopCommand from '../classes/commands/buckwheat/money/ShopCommand'
import TransferCommand from '../classes/commands/buckwheat/money/TransferCommand'
import WorkCommand from '../classes/commands/buckwheat/money/WorkCommand'
import PingCommand from '../classes/commands/buckwheat/other/PingCommand'
import RandomCommand from '../classes/commands/buckwheat/other/RandomCommand'
import ChangeDescriptionCommand from '../classes/commands/buckwheat/profile/ChangeDescriptionCommand'
import ChangeNameCommand from '../classes/commands/buckwheat/profile/ChangeNameCommand'
import ClassCommand from '../classes/commands/buckwheat/profile/ClassCommand'
import LinkCommand from '../classes/commands/buckwheat/profile/LinkCommand'
import ProfileCommand from '../classes/commands/buckwheat/profile/ProfileCommand'
import RemoveImageProfileCommand from '../classes/commands/buckwheat/profile/RemoveImageProfileCommand'
import SearchCommand from '../classes/commands/buckwheat/profile/SearchCommand'
import EchoCommand from '../classes/commands/buckwheat/say/EchoCommand'
import SayCommand from '../classes/commands/buckwheat/say/SayCommand'
import ButtonAccessCommand from '../classes/commands/buckwheat/settings/ButtonAccessCommand'
import CommandAccessCommand from '../classes/commands/buckwheat/settings/CommandAccessCommand'
import RankSettingsCommand from '../classes/commands/buckwheat/settings/RankSettingsCommand'
import SettingsCommand from '../classes/commands/buckwheat/settings/SettingsCommand'
import TopCommand from '../classes/commands/buckwheat/top/TopCommand'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import CustomRoleplayCommand from '../classes/commands/conditional/CustomRoleplayCommand'
import OnDuelCommand from '../classes/commands/conditional/OnDuelCommand'
import MarketCommand from '../classes/commands/market/MarketCommand'
import HelpCommand from '../classes/commands/telegram/HelpCommand'
import PaySupportCommand from '../classes/commands/telegram/PaySupportCommand'
import StartCommand from '../classes/commands/telegram/StartCommand'
import TelegramCommandsCommand from '../classes/commands/telegram/TelegramCommandsCommand'
import CasinoDice from '../classes/dice/CasinoDice'
import DiceDice from '../classes/dice/DiceDice'
import Bot from '../classes/main/Bot'
import CallbackButtonActionHandler from '../classes/main/handlers/CallbackButtonActionHandler'
import CommandHandler from '../classes/main/handlers/commands/CommandHandler'
import ConditionalCommandHandler from '../classes/main/handlers/commands/ConditionalCommandHandler'
import TelegramCommandHandler from '../classes/main/handlers/commands/TelegramCommandHandler'
import DiceHandler from '../classes/main/handlers/DiceHandler'
import EveryMessageHandler from '../classes/main/handlers/EveryMessageHandler'
import LeftMemberHandler from '../classes/main/handlers/LeftMemberHandler'
import MyChatMemberHandler from '../classes/main/handlers/MyChatMemberHandler'
import NewMemberHandler from '../classes/main/handlers/NewMemberHandler'
import PaymentHandler from '../classes/main/handlers/PaymentHandler'
import SceneActionHandler from '../classes/main/handlers/SceneActionHandler'
import PhotoHandler from '../classes/main/handlers/showable/PhotoHandler'
import InventoryItemsUtils from '../utils/InventoryItemsUtils'
import Logging from '../utils/Logging'
import StartValidator from '../utils/StartValidator'
import { DOMAIN, MODE, TOKEN } from '../utils/values/consts'
import { connectDatabase } from './db'
import MarketBuyShowAction from '../classes/callback-button/market/buy/MarketBuyShowAction'
import MarketBuyAction from '../classes/callback-button/market/buy/MarketBuyAction'
import MarketSlotService from '../classes/db/services/market/MarketSlotService'
import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import { DataFromCallbackButton } from '../utils/values/types/types'
import MarketSellCountAction from '../classes/callback-button/market/sell/MarketSellCountAction'
import MarketSellAction from '../classes/callback-button/market/sell/MarketSellAction'
import MarketSellSceneAction from '../classes/actions/scenes/market/MarketSellSceneAction'
import RateLimitCommand from '../classes/commands/conditional/RateLimitCommand'

const isEnvVarsValidate = () => {
    StartValidator.validate([
        StartValidator.createVariable('BOT_TOKEN'),
        StartValidator.createVariable('DB_NAME'),
        StartValidator.createVariable('DB_URL'),
        StartValidator.createVariable('CHAT_ID'),
        StartValidator.createVariable('DEV_ID', false),
        StartValidator.createVariable('MODE', false),
        StartValidator.createVariable('DOMAIN', false),
        StartValidator.createVariable('HOOK_PORT', false),
        StartValidator.createVariable('SECRET_TOKEN', false),
        StartValidator.createVariable('SECRET_PATH', false),
        StartValidator.createVariable('DB_USERNAME', false),
        StartValidator.createVariable('DB_PASSWORD', false),
        StartValidator.createVariable('ALLOWED_CHATS', false),
        StartValidator.createVariable('HTTP_PROXY', false),
    ])

    return true
}

const getCommands = async <
    T extends typeof SimpleBuckwheatCommand
>(folderPath: string, CommandClass: T): Promise<InstanceType<T>[]> => {
    let result: InstanceType<T>[] = []
    const resourceSource = './res'
    const parentSource = `json/${folderPath}`

    for await (const src of await readdir(join(resourceSource, parentSource))) {
        result.push(
            await CommandClass.loadFromJsonResource(
                join(parentSource, src)
            ) as InstanceType<T>
        )
    }

    return result
}

const getSimpleCommands = async () => {
    return await getCommands('simple_commands', SimpleBuckwheatCommand)
}

const launchBot = async (bot: Bot) => {
    // handlers
    const sceneActionHandler = new SceneActionHandler()
    const everyMessageHandler = new EveryMessageHandler()
    const telegramCommandHandler = new TelegramCommandHandler()
    const commandHandler = new CommandHandler()
    const conditionalCommandHandler = new ConditionalCommandHandler()
    const callbackButtonActionHandler = new CallbackButtonActionHandler()
    const diceHandler = new DiceHandler()
    const newMemberHandler = new NewMemberHandler()
    const photoHandler = new PhotoHandler()
    const leftMemberHandler = new LeftMemberHandler()
    const paymentHandler = new PaymentHandler()
    const myChatMemberHandler = new MyChatMemberHandler()

    // every message 
    everyMessageHandler.add(
        new NotAllowedChatAction(), // it should be first
        new WrongChatAction(), // it should be second
        new AntiSpamAction(),
        new AddProfileAction(),
        new NewMessagesAction(),
        new RandomPrizeMessageAction(),
        new ReactionAction()
    )

    // left member 
    leftMemberHandler.add(
        new AddLeftInDatabaseAction()
    )

    // callback button 
    callbackButtonActionHandler.add(
        new TestAction(),
        new CubeYesAction(),
        new CubeNoAction(),
        new RuleChangeAction(),
        new ItemChangeAction(),
        new BuyAction(),
        new VerificationAction(),
        new RandomPrizeButtonAction(),
        new ClassAction(),
        new IdeaChangeAction(),
        new VoteAction(),
        new DeleteIdeaAction(),
        new CommandsChangeAction(),
        new RoleplayChangeAction(),
        new AwardsChangeAction(),
        new MarryYesAction(),
        new MarryNoAction(),
        new DeleteMessageAction(),
        new DuelNoAction(),
        new DuelYesAction(),
        new DuelStartAction(),
        new DuelAwayAction(),
        new DuelFightAction(),
        new DuelSkillAction(),
        new DuelEffectsAction(),
        new WipeAction(),
        new SkillMenuAction(),
        new SkillViewAction(),
        new SkillChangeAction(),
        new SkillAddAction(),
        new SkillRemoveAction(),
        new SkillUseAction(),
        new SkillAlertAction(),
        new EffectChangeAction(),
        new FaqChangeAction(),
        new FaqAction(),
        new SettingsChangeAction(),
        new SettingsShowAction(),
        new SettingSetAction(),
        new TopChangeAction(),
        new CardChangeAction(),
        new SuggestedCardChangeAction(),
        new SuggestedCardAddAction(),
        new SuggestCardEnterAction(),
        new CardStatsAction(),
        new UnpackCardAction(),
        new CardShopAction(),
        new CardBuyChangeAction(),
        new CardBuyShowAction(),
        new CardBuyAction(),
        new CardSellChangeAction(),
        new CardSellAction(),
        new ItemShowAction(),
        new ExportAction(),
        new ImportAction(),
        new GeneratorChangeAction(),
        new GeneratorAddAction(),
        new GeneratorShowAction(),
        new GeneratorCollectAction(),
        new GeneratorUpgradeAction(),
        new InventoryChangeAction(),
        new InventoryShowAction(),
        new MarketBuyChangeAction(),
        new MarketBuyShowAction(),
        new MarketBuyAction(),
        new MarketSellCountAction(),
        new MarketSellAction(),
    )

    // dice 
    diceHandler.add(
        new CasinoDice(),
        new DiceDice()
    )

    // new member 
    newMemberHandler.add(
        new AddInDatabaseAction(),
        new DebtMemberAction(),
        new HelloMemberAction(),
    )

    // payment
    paymentHandler.add(
        new SubscriptionAction(),
        new DonateAction()
    )

    // conditional
    conditionalCommandHandler.add(
        new RateLimitCommand(),
        new CapsCommand(),
        new OnDuelCommand(),
        new CustomRoleplayCommand(),
    )

    // buckwheat
    commandHandler.add(
        new PremiumCommand(),
        new DonateCommand(),
        new CommandsCommand(),
        new CommandAccessCommand(),
        new ButtonAccessCommand(),
        new FaqCommand(),
        new CreatorCommand(),
        new ProfileCommand(),
        new SettingsCommand(),
        new BalanceCommand(),
        new ChangeNameCommand(),
        new ChangeDescriptionCommand(),
        new TestCommand(),
        new EchoCommand(),
        new SayCommand(),
        new TransferCommand(),
        new RankCommand(),
        new MuteCommand(),
        new UnmuteCommand(),
        new BanCommand(),
        new UnbanCommand(),
        new DeleteCommand(),
        new PingCommand(),
        new CubeCommand(),
        new UpdateCommand(),
        new RuleCommand(),
        new WorkCommand(),
        new HelloCommand(),
        new TopCommand(),
        new ShopCommand(),
        new InventoryCommand(),
        new ClassCommand(),
        new GreedBoxCommand(),
        new CookieCommand(),
        new IdeaCommand(),
        new InfoCommand(),
        new MoneyDropCommand(),
        new RoleplayCommand(),
        new ExperienceCommand(),
        new LevelCommand(),
        new LinkCommand(),
        new RandomCommand(),
        new RouletteCommand(),
        new MarriageCommand(),
        new MarryCommand(),
        new DivorceCommand(),
        new WipeCommand(),
        new ChooseCommand(),
        new SaveCommand(),
        new CharsCommand(),
        // new DuelCommand(),
        new SkillsCommand(),
        new EffectsCommand(),
        new ChatCommand(),
        new StatsCommand(),
        new AddAwardCommand(),
        new GetAwardCommand(),
        new BroadcastCommand(),
        new CardCommand(),
        new SummonCommand(),
        new ExportCommand(),
        new ImportCommand(),
        new PinCommand(),
        new UnpinCommand(),
        new GeneratorCommand(),
        new SearchCommand(),
        new RemoveImageProfileCommand(),
        new RankSettingsCommand(),
        new MarketCommand(),
        ...await getSimpleCommands(),
    )

    // photo 
    photoHandler.add(
        new ImageProfileAction()
    )

    // tg
    telegramCommandHandler.add(
        new StartCommand(),
        new PaySupportCommand(),
        new HelpCommand(),
        new TelegramCommandsCommand(),
    )

    // scenes
    sceneActionHandler.add(
        new SettingNumberAction(),
        new SettingStringAction(),
        new SuggestCardAction(),
        new CardPriceSellAction(),
        new ImportSceneAction(),
        new MarketSellSceneAction()
    )

    // my chat member
    myChatMemberHandler.add(
        new CheckDeletingFromChatAction()
    )

    // setup handlers
    bot.addHandlers(
        sceneActionHandler,
        everyMessageHandler,
        conditionalCommandHandler,
        telegramCommandHandler,
        commandHandler,
        callbackButtonActionHandler,
        diceHandler,
        newMemberHandler,
        photoHandler,
        leftMemberHandler,
        paymentHandler,
        myChatMemberHandler
    )

    console.log('Start launching!')
    await bot.launch(Boolean(DOMAIN))
}

const test = async (): Promise<void | boolean> => {
    
}

const main = async () => {
    if (!await InventoryItemsUtils.setup()) return
    if (!isEnvVarsValidate()) return
    await connectDatabase()

    mongoose.set('debug', (collectionName, method, ...other) => {
        Logging.system(`${collectionName}.${method}`, other)
    })

    if (MODE == 'dev' && await test()) {
        await disconnect()
        return
    }

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()