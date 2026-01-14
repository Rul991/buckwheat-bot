import Bot from '../classes/main/Bot'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import NoCommand from '../classes/commands/conditional/NoCommand'
import TestCommand from '../classes/commands/buckwheat/dev/TestCommand'
import { DOMAIN, MODE, TOKEN } from '../utils/values/consts'
import StartValidator from '../utils/StartValidator'
import StartCommand from '../classes/commands/telegram/StartCommand'
import EchoCommand from '../classes/commands/buckwheat/say/EchoCommand'
import SimpleBuckwheatCommand from '../classes/commands/base/SimpleBuckwheatCommand'
import { connectDatabase } from './db'
import { join } from 'path'
import ProfileCommand from '../classes/commands/buckwheat/profile/ProfileCommand'
import ChangeNameCommand from '../classes/commands/buckwheat/profile/ChangeNameCommand'
import CasinoDice from '../classes/dice/CasinoDice'
import WrongChatAction from '../classes/actions/every/WrongChatAction'
import BalanceCommand from '../classes/commands/buckwheat/money/BalanceCommand'
import TransferCommand from '../classes/commands/buckwheat/money/TransferCommand'
import ChangeDescriptionCommand from '../classes/commands/buckwheat/profile/ChangeDescriptionCommand'
import CreatorCommand from '../classes/commands/buckwheat/admins/CreatorCommand'
import RankCommand from '../classes/commands/buckwheat/admins/RankCommand'
import { readdir } from 'fs/promises'
import MuteCommand from '../classes/commands/buckwheat/admins/MuteCommand'
import PingCommand from '../classes/commands/buckwheat/other/PingCommand'
import UnmuteCommand from '../classes/commands/buckwheat/admins/UnmuteCommand'
import BanCommand from '../classes/commands/buckwheat/admins/BanCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import CubeYesAction from '../classes/callback-button/cube/CubeYesAction'
import CubeCommand from '../classes/commands/buckwheat/money/CubeCommand'
import CubeNoAction from '../classes/callback-button/cube/CubeNoAction'
import UpdateCommand from '../classes/commands/buckwheat/dev/UpdateCommand'
import AntiSpamAction from '../classes/actions/every/AntiSpamAction'
import RuleCommand from '../classes/commands/buckwheat/chat/RuleCommand'
import RuleChangeAction from '../classes/callback-button/scrollers/page/RuleChangeAction'
import WorkCommand from '../classes/commands/buckwheat/money/WorkCommand'
import CommandsCommand from '../classes/commands/buckwheat/info/CommandsCommand'
import DonateCommand from '../classes/commands/buckwheat/fee/DonateCommand'
import HelloCommand from '../classes/commands/buckwheat/chat/HelloCommand'
import HelloMemberAction from '../classes/actions/new-member/HelloMemberAction'
import TopCommand from '../classes/commands/buckwheat/top/TopCommand'
import ImageProfileAction from '../classes/actions/photo/ImageProfileAction'
import ShopCommand from '../classes/commands/buckwheat/money/ShopCommand'
import ItemChangeAction from '../classes/callback-button/shop/ItemChangeAction'
import BuyAction from '../classes/callback-button/shop/BuyAction'
import InventoryCommand from '../classes/commands/buckwheat/info/InventoryCommand'
import VerificationAction from '../classes/callback-button/VerificationAction'
import RandomPrizeMessageAction from '../classes/actions/every/RandomPrizeMessageAction'
import RandomPrizeButtonAction from '../classes/callback-button/RandomPrizeButtonAction'
import NewMessagesAction from '../classes/actions/every/NewMessagesAction'
import ClassAction from '../classes/callback-button/ClassAction'
import ClassCommand from '../classes/commands/buckwheat/profile/ClassCommand'
import GreedBoxCommand from '../classes/commands/buckwheat/money/GreedBoxCommand'
import CookieCommand from '../classes/commands/buckwheat/game/CookieCommand'
import IdeaCommand from '../classes/commands/buckwheat/info/IdeaCommand'
import IdeaChangeAction from '../classes/callback-button/ideas/IdeaChangeAction'
import DeleteIdeaAction from '../classes/callback-button/ideas/DeleteIdeaAction'
import VoteAction from '../classes/callback-button/ideas/VoteAction'
import SaveCommand from '../classes/commands/buckwheat/duel/SaveCommand'
import InfoCommand from '../classes/commands/buckwheat/game/InfoCommand'
import MoneyDropCommand from '../classes/commands/buckwheat/game/MoneyDropCommand'
import RoleplayCommand from '../classes/commands/buckwheat/game/RoleplayCommand'
import CustomRoleplayCommand from '../classes/commands/conditional/CustomRoleplayCommand'
import ExperienceCommand from '../classes/commands/buckwheat/level/ExperienceCommand'
import AddInDatabaseAction from '../classes/actions/new-member/AddInDatabaseAction'
import LinkCommand from '../classes/commands/buckwheat/profile/LinkCommand'
import InventoryItemsUtils from '../utils/InventoryItemsUtils'
import AddLeftInDatabaseAction from '../classes/actions/left-member/AddLeftInDatabaseAction'
import RandomCommand from '../classes/commands/buckwheat/other/RandomCommand'
import CommandsChangeAction from '../classes/callback-button/scrollers/page/CommandsChangeAction'
import DiceDice from '../classes/dice/DiceDice'
import StatsCommand from '../classes/commands/buckwheat/info/StatsCommand'
import DebtMemberAction from '../classes/actions/new-member/ReturnMemberAction'
import LevelCommand from '../classes/commands/buckwheat/level/LevelCommand'
import RouletteCommand from '../classes/commands/buckwheat/game/RouletteCommand'
import RoleplayChangeAction from '../classes/callback-button/scrollers/page/RoleplayChangeAction'
import MarriageCommand from '../classes/commands/buckwheat/marriage/MarriageCommand'
import MarryCommand from '../classes/commands/buckwheat/marriage/MarryCommand'
import MarryYesAction from '../classes/callback-button/marry/MarryYesAction'
import DivorceCommand from '../classes/commands/buckwheat/marriage/DivorceCommand'
import MarryNoAction from '../classes/callback-button/marry/MarryNoAction'
import WipeCommand from '../classes/commands/buckwheat/admins/WipeCommand'
import ChooseCommand from '../classes/commands/buckwheat/game/ChooseCommand'
import AddAwardCommand from '../classes/commands/award/AddAwardCommand'
import GetAwardCommand from '../classes/commands/award/GetAwardCommand'
import AwardsChangeAction from '../classes/callback-button/scrollers/page/AwardsChangeAction'
import ChatCommand from '../classes/commands/buckwheat/chat/ChatCommand'
import DeleteMessageAction from '../classes/callback-button/DeleteMessageAction'
import PremiumCommand from '../classes/commands/buckwheat/chat/PremiumCommand'
import CallbackButtonActionHandler from '../classes/main/handlers/CallbackButtonActionHandler'
import CommandHandler from '../classes/main/handlers/commands/CommandHandler'
import TelegramCommandHandler from '../classes/main/handlers/commands/TelegramCommandHandler'
import DiceHandler from '../classes/main/handlers/DiceHandler'
import EveryMessageHandler from '../classes/main/handlers/EveryMessageHandler'
import LeftMemberHandler from '../classes/main/handlers/LeftMemberHandler'
import NewMemberHandler from '../classes/main/handlers/NewMemberHandler'
import PhotoHandler from '../classes/main/handlers/PhotoHandler'
import PaymentHandler from '../classes/main/handlers/PaymentHandler'
import SubscriptionAction from '../classes/actions/payment/SubscriptionAction'
import DonateAction from '../classes/actions/payment/DonateAction'
import PaySupportCommand from '../classes/commands/telegram/PaySupportCommand'
import CharsCommand from '../classes/commands/buckwheat/duel/CharsCommand'
import DuelNoAction from '../classes/callback-button/duels/DuelNoAction'
import DuelYesAction from '../classes/callback-button/duels/DuelYesAction'
import WipeAction from '../classes/callback-button/WipeAction'
import HelpCommand from '../classes/commands/telegram/HelpCommand'
import SkillViewAction from '../classes/callback-button/skills/SkillViewAction'
import SkillMenuAction from '../classes/callback-button/skills/SkillMenuAction'
import SkillChangeAction from '../classes/callback-button/skills/SkillChangeAction'
import SkillAddAction from '../classes/callback-button/skills/SkillAddAction'
import SkillRemoveAction from '../classes/callback-button/skills/SkillRemoveAction'
import TestAction from '../classes/callback-button/TestAction'
import DuelStartAction from '../classes/callback-button/duels/DuelStartAction'
import DuelAwayAction from '../classes/callback-button/duels/DuelAwayAction'
import IsPremiumCommand from '../classes/commands/conditional/IsPremiumCommand'
import OnDuelCommand from '../classes/commands/conditional/OnDuelCommand'
import DuelFightAction from '../classes/callback-button/duels/DuelFightAction'
import DuelSkillAction from '../classes/callback-button/duels/DuelSkillAction'
import SkillUseAction from '../classes/callback-button/duels/SkillUseAction'
import DuelEffectsAction from '../classes/callback-button/duels/DuelEffectsAction'
import SkillAlertAction from '../classes/callback-button/skills/SkillAlertAction'
import EffectChangeAction from '../classes/callback-button/effects/EffectChangeAction'
import NotAllowedChatAction from '../classes/actions/every/NotAllowedChatAction'
import { disconnect } from 'mongoose'
import FaqCommand from '../classes/commands/buckwheat/info/FaqCommand'
import FaqChangeAction from '../classes/callback-button/faq/FaqChangeAction'
import FaqAction from '../classes/callback-button/faq/FaqAction'
import DeleteCommand from '../classes/commands/buckwheat/admins/DeleteCommand'
import ReactionAction from '../classes/actions/every/ReactionAction'
import SettingsChangeAction from '../classes/callback-button/settings/SettingsChangeAction'
import SettingsCommand from '../classes/commands/buckwheat/settings/SettingsCommand'
import SettingsShowAction from '../classes/callback-button/settings/SettingsShowAction'
import SettingSetAction from '../classes/callback-button/settings/SettingSetAction'
import SceneActionHandler from '../classes/main/handlers/SceneActionHandler'
import NumberSettingInputAction from '../classes/actions/scenes/NumberSettingInputAction'
import TopChangeAction from '../classes/callback-button/top/TopChangeAction'
import BroadcastCommand from '../classes/commands/buckwheat/dev/BroadcastCommand'
import CardCommand from '../classes/commands/buckwheat/card/CardCommand'
import CardChangeAction from '../classes/callback-button/card/menu/CardChangeAction'
import SuggestedCardChangeAction from '../classes/callback-button/card/suggest/SuggestedCardChangeAction'
import SuggestCardAction from '../classes/actions/scenes/SuggestCardAction'
import SuggestedCardAddAction from '../classes/callback-button/card/suggest/SuggestedCardAddAction'
import SuggestCardEnterAction from '../classes/callback-button/card/suggest/SuggestCardEnterAction'
import CardStatsAction from '../classes/callback-button/card/menu/CardStatsAction'
import UnpackCardAction from '../classes/callback-button/card/menu/UnpackCardAction'
import CardShopAction from '../classes/callback-button/card/menu/CardShopAction'
import CardBuyChangeAction from '../classes/callback-button/card/shop/buy/CardBuyChangeAction'
import CardBuyAction from '../classes/callback-button/card/shop/buy/CardBuyAction'
import CardSellChangeAction from '../classes/callback-button/card/shop/sell/CardSellChangeAction'
import CardBuyShowAction from '../classes/callback-button/card/shop/buy/CardBuyShowAction'
import CardPriceSellAction from '../classes/actions/scenes/CardPriceSellAction'
import CardSellAction from '../classes/callback-button/card/shop/sell/CardSellAction'
import AddProfileAction from '../classes/actions/every/AddProfileAction'
import ItemShowAction from '../classes/callback-button/shop/ItemShowAction'
import SummonCommand from '../classes/commands/buckwheat/admins/SummonCommand'
import ExportCommand from '../classes/commands/buckwheat/data/ExportCommand'
import ExportAction from '../classes/callback-button/data/ExportAction'
import ImportAction from '../classes/callback-button/data/ImportAction'
import ImportSceneAction from '../classes/actions/scenes/ImportSceneAction'
import ImportCommand from '../classes/commands/buckwheat/data/ImportCommand'
import SayCommand from '../classes/commands/buckwheat/say/SayCommand'
import PinCommand from '../classes/commands/buckwheat/admins/PinCommand'
import UnpinCommand from '../classes/commands/buckwheat/admins/UnpinCommand'
import TelegramCommandsCommand from '../classes/commands/telegram/TelegramCommandsCommand'
import GeneratorCommand from '../classes/commands/buckwheat/money/GeneratorCommand'
import GeneratorChangeAction from '../classes/callback-button/generator/GeneratorChangeAction'
import GeneratorAddAction from '../classes/callback-button/generator/GeneratorAddAction'
import GeneratorShowAction from '../classes/callback-button/generator/GeneratorShowAction'
import GeneratorCollectAction from '../classes/callback-button/generator/GeneratorCollectAction'
import GeneratorUpgradeAction from '../classes/callback-button/generator/GeneratorUpgradeAction'
import SearchCommand from '../classes/commands/buckwheat/profile/SearchCommand'

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
    bot.addHandlers(
        new SceneActionHandler(),
        new EveryMessageHandler(),
        new TelegramCommandHandler(),
        new CommandHandler(),
        new CallbackButtonActionHandler(),
        new DiceHandler(),
        new NewMemberHandler(),
        new PhotoHandler(),
        new LeftMemberHandler(),
        new PaymentHandler(),
    )

    // every message 
    bot.addActions(
        new NotAllowedChatAction(), // it should be first
        new WrongChatAction(), // it should be second
        new AntiSpamAction(),
        new AddProfileAction(),
        new NewMessagesAction(),
        new RandomPrizeMessageAction(),
        new ReactionAction()
    )

    // left member 
    bot.addActions(
        new AddLeftInDatabaseAction()
    )

    // photo 
    bot.addActions(
        new ImageProfileAction()
    )

    // callback button 
    bot.addActions(
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
    )

    // dice 
    bot.addActions(
        new CasinoDice(),
        new DiceDice()
    )

    // new member 
    bot.addActions(
        new AddInDatabaseAction(),
        new DebtMemberAction(),
        new HelloMemberAction(),
    )

    // payment
    bot.addActions(
        new SubscriptionAction(),
        new DonateAction()
    )

    // conditional
    bot.addActions(
        new CapsCommand(),
        new NoCommand(),
        new OnDuelCommand(),
        new IsPremiumCommand(),
        new CustomRoleplayCommand(),
    )

    // buckwheat
    bot.addActions(
        new PremiumCommand(),
        new DonateCommand(),
        new CommandsCommand(),
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
        // new SkillsCommand(),
        // new EffectsCommand(),
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
        ...await getSimpleCommands(),
    )

    // tg
    bot.addActions(
        new StartCommand(),
        new PaySupportCommand(),
        new HelpCommand(),
        new TelegramCommandsCommand(),
    )

    // scenes
    bot.addActions(
        new NumberSettingInputAction(),
        new SuggestCardAction(),
        new CardPriceSellAction(),
        new ImportSceneAction(),
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

    if (MODE == 'dev' && await test()) {
        await disconnect()
        return
    }

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()