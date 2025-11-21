import Bot from '../classes/main/Bot'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import NoCommand from '../classes/commands/conditional/NoCommand'
import TestCommand from '../classes/commands/buckwheat/dev/TestCommand'
import { DOMAIN, MODE, TOKEN } from '../utils/values/consts'
import StartValidator from '../utils/StartValidator'
import StartCommand from '../classes/commands/telegram/StartCommand'
import EchoCommand from '../classes/commands/buckwheat/game/EchoCommand'
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
import { env } from 'process'
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
import DebtMemberAction from '../classes/actions/new-member/DebtMemberAction'
import ChannelCommand from '../classes/commands/buckwheat/info/ChannelCommand'
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
import DuelCommand from '../classes/commands/buckwheat/duel/DuelCommand'
import DuelNoAction from '../classes/callback-button/duels/DuelNoAction'
import DuelYesAction from '../classes/callback-button/duels/DuelYesAction'
import WipeAction from '../classes/callback-button/WipeAction'
import HelpCommand from '../classes/commands/telegram/HelpCommand'
import SkillsCommand from '../classes/commands/buckwheat/duel/SkillsCommand'
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
import InventoryItemService from '../classes/db/services/items/InventoryItemService'
import EffectsCommand from '../classes/commands/buckwheat/duel/EffectsCommand'
import EffectChangeAction from '../classes/callback-button/effects/EffectChangeAction'
import FileUtils from '../utils/FileUtils'
import NotAllowedChatAction from '../classes/actions/every/NotAllowedChatAction'

const isEnvVarsValidate = () => {
    type EnvVariable = { name: string, isMustDefined: boolean }

    const createVariable = (name: string, isMustDefined = true) =>
        ({ name, isMustDefined } as EnvVariable)

    const variables = [
        createVariable('BOT_TOKEN'),
        createVariable('DB_NAME'),
        createVariable('DB_URL'),
        createVariable('CHAT_ID'),
        createVariable('DEV_ID', false),
        createVariable('MODE', false),
        createVariable('DOMAIN', false),
        createVariable('HOOK_PORT', false),
        createVariable('SECRET_TOKEN', false),
        createVariable('SECRET_PATH', false),
        createVariable('DB_USERNAME', false),
        createVariable('DB_PASSWORD', false),
        createVariable('ALLOWED_CHATS', false),
    ]

    for (const variable of variables) {
        if (!StartValidator.isEnvVariableDefined(env[variable.name])) {
            const message = `undefined ${variable.name}`

            if (!variable.isMustDefined) {
                console.warn(message)
            }
            else {
                console.error(message)
                return false
            }
        }
    }

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
        new EveryMessageHandler(),
        new TelegramCommandHandler(),
        new CommandHandler(),
        new CallbackButtonActionHandler(),
        new DiceHandler(),
        new NewMemberHandler(),
        new PhotoHandler(),
        new LeftMemberHandler(),
        new PaymentHandler()
    )

    // every message 
    bot.addActions(
        new WrongChatAction(), // it should be first
        new NotAllowedChatAction(), // it should be second
        new AntiSpamAction(),
        new NewMessagesAction(),
        new RandomPrizeMessageAction(),
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
    )

    // dice 
    bot.addActions(
        new CasinoDice(),
        new DiceDice()
    )

    // new member 
    bot.addActions(
        new AddInDatabaseAction(),
        new HelloMemberAction(),
        new DebtMemberAction(),
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
        new ProfileCommand(),
        new CreatorCommand(),
        new BalanceCommand(),
        new ChangeNameCommand(),
        new ChangeDescriptionCommand(),
        new TestCommand(),
        new EchoCommand(),
        new TransferCommand(),
        new RankCommand(),
        new MuteCommand(),
        new UnmuteCommand(),
        new BanCommand(),
        new UnbanCommand(),
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
        new ChannelCommand(),
        new RouletteCommand(),
        new MarriageCommand(),
        new MarryCommand(),
        new DivorceCommand(),
        new WipeCommand(),
        new ChooseCommand(),
        new SaveCommand(),
        new CharsCommand(),
        new DuelCommand(),
        new SkillsCommand(),
        new EffectsCommand(),
        new ChatCommand(),
        new StatsCommand(),
        new AddAwardCommand(),
        new GetAwardCommand(),
        ...await getSimpleCommands(),
    )

    // tg
    bot.addActions(
        new StartCommand(),
        new PaySupportCommand(),
        new HelpCommand()
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

    if (MODE == 'dev') {
        if (await test()) return
    }

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()