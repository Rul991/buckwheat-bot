import Bot from '../classes/main/Bot'
import CapsCommand from '../classes/commands/conditional/CapsCommand'
import NoCommand from '../classes/commands/conditional/NoCommand'
import TestCommand from '../classes/commands/buckwheat/TestCommand'
import { DOMAIN, MODE, TOKEN } from '../utils/values/consts'
import Validator from '../utils/Validator'
import StartCommand from '../classes/commands/telegram/StartCommand'
import EchoCommand from '../classes/commands/buckwheat/EchoCommand'
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
import PingCommand from '../classes/commands/buckwheat/PingCommand'
import UnmuteCommand from '../classes/commands/buckwheat/admins/UnmuteCommand'
import BanCommand from '../classes/commands/buckwheat/admins/BanCommand'
import UnbanCommand from '../classes/commands/buckwheat/admins/UnbanCommand'
import CubeYesAction from '../classes/callback-button/cube/CubeYesAction'
import CubeCommand from '../classes/commands/buckwheat/money/CubeCommand'
import CubeNoAction from '../classes/callback-button/cube/CubeNoAction'
import UpdateCommand from '../classes/commands/buckwheat/UpdateCommand'
import AntiSpamAction from '../classes/actions/every/AntiSpamAction'
import RuleCommand from '../classes/commands/buckwheat/chat/RuleCommand'
import RuleChangeAction from '../classes/callback-button/RuleChangeAction'
import WorkCommand from '../classes/commands/buckwheat/money/WorkCommand'
import { env } from 'process'
import CommandsCommand from '../classes/commands/buckwheat/CommandsCommand'
import DonateCommand from '../classes/commands/buckwheat/DonateCommand'
import HelloCommand from '../classes/commands/buckwheat/chat/HelloCommand'
import HelloMemberAction from '../classes/actions/new-member/HelloMemberAction'
import TopCommand from '../classes/commands/buckwheat/top/TopCommand'
import ImageProfileAction from '../classes/actions/photo/ImageProfileAction'
import ShopCommand from '../classes/commands/buckwheat/money/ShopCommand'
import ItemChangeAction from '../classes/callback-button/shop/ItemChangeAction'
import BuyAction from '../classes/callback-button/shop/BuyAction'
import InventoryCommand from '../classes/commands/buckwheat/InventoryCommand'
import VerificationAction from '../classes/callback-button/VerificationAction'
import RandomPrizeMessageAction from '../classes/actions/every/RandomPrizeMessageAction'
import RandomPrizeButtonAction from '../classes/callback-button/RandomPrizeButtonAction'
import NewMessagesAction from '../classes/actions/every/NewMessagesAction'
import WhereMarriageAction from '../classes/actions/every/WhereMarriageAction'
import ClassAction from '../classes/callback-button/ClassAction'
import ClassCommand from '../classes/commands/buckwheat/profile/ClassCommand'
import GreadBoxCommand from '../classes/commands/buckwheat/GreadBoxCommand'
import CookieCommand from '../classes/commands/buckwheat/CookieCommand'
import RoleplayCommand from '../classes/commands/base/RoleplayCommand'
import IdeaCommand from '../classes/commands/buckwheat/IdeaCommand'
import IdeaChangeAction from '../classes/callback-button/ideas/IdeaChangeAction'
import DeleteIdeaAction from '../classes/callback-button/ideas/DeleteIdeaAction'
import VoteAction from '../classes/callback-button/ideas/VoteAction'
import SaveCommand from '../classes/commands/buckwheat/SaveCommand'
import InfoCommand from '../classes/commands/buckwheat/InfoCommand'
import MoneyDropCommand from '../classes/commands/buckwheat/MoneyDropCommand'
import AddRoleplayCommand from '../classes/commands/buckwheat/AddRoleplayCommand'
import CustomRoleplayCommand from '../classes/commands/conditional/CustomRoleplayCommand'
import UserClassService from '../classes/db/services/user/UserClassService'
import UserDescriptionService from '../classes/db/services/user/UserDescriptionService'
import UserNameService from '../classes/db/services/user/UserNameService'
import UserRankService from '../classes/db/services/user/UserRankService'
import RankUtils from '../utils/RankUtils'
import ExperienceCommand from '../classes/commands/buckwheat/level/ExperienceCommand'
import AddInDatabaseAction from '../classes/actions/new-member/AddInDatabaseAction'
import BuckwheatEnterAction from '../classes/actions/new-member/BuckwheatEnterAction'

const isEnvVarsValidate = () => {
    type EnvVariable = {name: string, isMustDefined: boolean}

    const createVariable = (name: string, isMustDefined = true) => 
        ({name, isMustDefined} as EnvVariable)

    const variables = [
        createVariable('BOT_TOKEN'),
        createVariable('DB_NAME'),
        createVariable('DB_URL'),
        createVariable('CHAT_ID'),
        createVariable('EMPTY_PROFILE_IMAGE', false),
        createVariable('DEV_ID', false),
        createVariable('MODE', false),
        createVariable('DOMAIN', false),
        createVariable('HOOK_PORT', false),
        createVariable('SECRET_TOKEN', false),
        createVariable('SECRET_PATH', false),
    ]

    for (const variable of variables) {
        if(!Validator.isEnvVariableDefined(env[variable.name])) {
            const message = `undefined ${variable.name}`

            if(!variable.isMustDefined) {
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

const getRoleplayCommands = async () => {
    return await getCommands('rp', RoleplayCommand)
}

const getSimpleCommands = async () => {
    return await getCommands('simple_commands', SimpleBuckwheatCommand)
}

const launchBot = async (bot: Bot) => {
    bot.addEveryMessageActions(
        new WrongChatAction(), // it should be first
        new AntiSpamAction(), 
        new NewMessagesAction(),
        new WhereMarriageAction(),
        new RandomPrizeMessageAction(),
    )

    bot.addPhotoActions(
        new ImageProfileAction()
    )

    bot.addCallbackButtonAction(
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
    )

    bot.addDiceActions(
        new CasinoDice()
    )

    bot.addNewMemberAction(
        new HelloMemberAction(),
        new AddInDatabaseAction(),
        new BuckwheatEnterAction(),
    )

    // conditional
    bot.addCommands(
        new CapsCommand(),
        new NoCommand(),
        new CustomRoleplayCommand()
    )
    
    // buckwheat
    bot.addCommands(
        new CommandsCommand(),
        new ProfileCommand(),
        new BalanceCommand(),
        new ChangeNameCommand(),
        new ChangeDescriptionCommand(),
        new TestCommand(),
        new EchoCommand(),
        new TransferCommand(),
        new CreatorCommand(),
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
        new DonateCommand(),
        new HelloCommand(),
        new TopCommand(),
        new ShopCommand(),
        new InventoryCommand(),
        new ClassCommand(),
        new GreadBoxCommand(),
        new CookieCommand(),
        new IdeaCommand(),
        new SaveCommand(),
        new InfoCommand(),
        new MoneyDropCommand(),
        new AddRoleplayCommand(),
        new ExperienceCommand(),
        ...await getSimpleCommands(),
        ...await getRoleplayCommands()
    )
    
    // tg
    bot.addCommands(
        new StartCommand()
    )

    await bot.launch(Boolean(DOMAIN), async () => setBotParameters(bot))
}

const setBotParameters = async (bot: Bot) => {
    const { botInfo } = bot.bot
    if(!botInfo) return 

    const { id } = botInfo

    const currentName = await UserNameService.get(id)
    const needName = 'Баквит'

    if(currentName === needName) return

    await UserNameService.update(id, needName)
    await UserDescriptionService.update(id, 'Я ваш проводник в данном чате')
    await UserRankService.update(id, RankUtils.admin)
    await UserClassService.update(id, 'boss')
}

const test = async (): Promise<void> => {
    
}

const main = async () => {
    if(MODE == 'dev')
        await test()
    
    if(!isEnvVarsValidate()) return
    await connectDatabase()

    const bot = new Bot(TOKEN)
    await launchBot(bot)
}

main()