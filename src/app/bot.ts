import DevButton from "../bot/actions/callback-query/dev/DevButton"
import DevCommand from "../bot/actions/commands/buckwheat/dev/DevCommand"
import CreateProfileAction from "../bot/actions/message/CreateProfileAction"
import CallbackQueryHandler from "../bot/handlers/callback/CallbackQueryHandler"
import BuckwheatCommandHandler from "../bot/handlers/showable/BuckwheatCommandHandler"
import MessageHandler from "../bot/handlers/message/MessageHandler"
import TelegramBot from "../bot/main/TelegramBot"
import ProfileCommand from "../bot/actions/commands/buckwheat/user/ProfileCommand"
import CommandsCommand from "../bot/actions/commands/buckwheat/info/CommandsCommand"
import LinkCommand from "../bot/actions/commands/buckwheat/link/LinkCommand"
import CreatorCommand from "../bot/actions/commands/buckwheat/admin/CreatorCommand"
import CommandsScrollerButton from "../bot/actions/callback-query/commands/CommandsScrollerButton"
import ConditionalCommandHandler from "../bot/handlers/message/ConditionalCommandHandler"
import CapsConditionalCommand from "../bot/actions/commands/conditional/CapsConditionalCommand"
import SimpleBuckwheatCommand from "../bot/actions/commands/buckwheat/simple/SimpleBuckwheatCommand"
import CommandUtils from "../utils/command/CommandUtils"
import DiceHandler from "../bot/handlers/dice/DiceHandler"
import CubeDiceAction from "../bot/actions/dice/CubeDiceAction"
import CasinoDiceAction from "../bot/actions/dice/CasinoDiceAction"
import BalanceCommand from "../bot/actions/commands/buckwheat/money/BalanceCommand"
import ClassCommand from "../bot/actions/commands/buckwheat/player/ClassCommand"
import ChangeClassButton from "../bot/actions/callback-query/user/ChangeClassButton"
import KickCommand from "../bot/actions/commands/buckwheat/admin/KickCommand"
import BanCommand from "../bot/actions/commands/buckwheat/admin/BanCommand"
import UnBanCommand from "../bot/actions/commands/buckwheat/admin/UnBanCommand"
import MuteCommand from "../bot/actions/commands/buckwheat/admin/MuteCommand"
import UnMuteCommand from "../bot/actions/commands/buckwheat/admin/UnMuteCommand"
import BotUseHandler from "../bot/handlers/use/BotUseHandler"
import PrivateMessageAction from "../bot/actions/message/PrivateMessageAction"
import AvaCommand from "../bot/actions/commands/buckwheat/change-profile/AvaCommand"
import PhotoActionHandler from "../bot/handlers/showable/PhotoActionHandler"
import SetAvaPhotoAction from "../bot/actions/photo/SetAvaPhotoAction"
import ChangeUsernameMessageAction from "../bot/actions/message/ChangeUsernameMessageAction"
import EchoCommand from "../bot/actions/commands/buckwheat/say/EchoCommand"
import RandomCommand from "../bot/actions/commands/buckwheat/random/RandomCommand"
import ConversationHandler from "../bot/handlers/conversations/ConversationHandler"
import SetNameCommand from "../bot/actions/commands/buckwheat/change-profile/SetNameCommand"
import SetDescriptionCommand from "../bot/actions/commands/buckwheat/change-profile/SetDescriptionCommand"
import ChooseCommand from "../bot/actions/commands/buckwheat/random/ChooseCommand"
import InfoCommand from "../bot/actions/commands/buckwheat/random/InfoCommand"
import LevelUpUseAction from "../bot/actions/after/LevelUpUseAction"
import SendMoneyCommand from "../bot/actions/commands/buckwheat/money/SendMoneyCommand"
import DeleteCommand from "../bot/actions/commands/buckwheat/admin/DeleteCommand"
import PinCommand from "../bot/actions/commands/buckwheat/admin/PinCommand"
import UnpinCommand from "../bot/actions/commands/buckwheat/admin/UnpinCommand"
import LevelCommand from "../bot/actions/commands/buckwheat/level/LevelCommand"
import ExperienceCommand from "../bot/actions/commands/buckwheat/level/ExperienceCommand"
import RankCommand from "../bot/actions/commands/buckwheat/admin/RankCommand"
import SettingScrollerButton from "../bot/actions/callback-query/settings/SettingScrollerButton"
import SettingShowButton from "../bot/actions/callback-query/settings/SettingShowButton"
import SettingCommand from "../bot/actions/commands/buckwheat/settings/SettingCommand"
import WhomCommand from "../bot/actions/commands/buckwheat/random/WhomCommand"
import MoneyDropCommand from "../bot/actions/commands/buckwheat/random/MoneyDropCommand"
import PingCommand from "../bot/actions/commands/buckwheat/ping/PingCommand"
import SummonCommand from "../bot/actions/commands/buckwheat/ping/SummonCommand"
import NewMessageAction from "../bot/actions/message/NewMessageAction"
import IdeaCommand from "../bot/actions/commands/buckwheat/ideas/IdeaCommand"
import IdeaScrollerButton from "../bot/actions/callback-query/ideas/IdeaScrollerButton"
import IdeaVoteButton from "../bot/actions/callback-query/ideas/IdeaVoteButton"
import IdeaDeleteButton from "../bot/actions/callback-query/ideas/IdeaDeleteButton"
import RouletteCommand from "../bot/actions/commands/buckwheat/game/RouletteCommand"
import NewChatMemberHandler from "../bot/handlers/chat-member/NewChatMemberHandler"
import HelloNewChatMemberAction from "../bot/actions/new-chat-member/HelloNewChatMemberAction"
import ReactionMessageAction from "../bot/actions/message/ReactionMessageAction"
import HelloCommand from "../bot/actions/commands/buckwheat/chat/HelloCommand"
import MessagesCommand from "../bot/actions/commands/buckwheat/user/MessagesCommand"
import WorkCommand from "../bot/actions/commands/buckwheat/money/WorkCommand"
import RandomPrizeMessageAction from "../bot/actions/message/RandomPrizeMessageAction"
import OpenRandomPrizeButton from "../bot/actions/callback-query/box/OpenRandomPrizeButton"
import CubeCommand from "../bot/actions/commands/buckwheat/game/CubeCommand"
import CubeStartButton from "../bot/actions/callback-query/cube/CubeStartButton"
import RandomStickerMessageAction from "../bot/actions/message/RandomStickerMessageAction"
import StickerCommand from "../bot/actions/commands/buckwheat/chat/StickerCommand"
import ChatCommand from "../bot/actions/commands/buckwheat/chat/ChatCommand"
import RoleplayCommand from "../bot/actions/commands/buckwheat/rp/RoleplayCommand"
import AddRoleplayConversation from "../bot/actions/conversations/rp/AddRoleplayConversation"
import RoleplayAddButton from "../bot/actions/callback-query/rp/RoleplayAddButton"
import RoleplayConditionalCommand from "../bot/actions/commands/conditional/RoleplayConditionalCommand"
import RoleplayChangeCaseButton from "../bot/actions/callback-query/rp/RoleplayChangeCaseButton"
import EditTextRoleplayConversation from "../bot/actions/conversations/rp/EditTextRoleplayConversation"
import RoleplayEditTextButton from "../bot/actions/callback-query/rp/RoleplayEditTextButton"
import RoleplayScrollerButton from "../bot/actions/callback-query/rp/RoleplayScrollerButton"
import RoleplayShowButton from "../bot/actions/callback-query/rp/RoleplayShowButton"
import RoleplayDeleteButton from "../bot/actions/callback-query/rp/RoleplayDeleteButton"
import RuleCommand from "../bot/actions/commands/buckwheat/rule/RuleCommand"
import RuleScrollerButton from "../bot/actions/callback-query/rule/RuleScrollerButton"
import RuleDeleteButton from "../bot/actions/callback-query/rule/RuleDeleteButton"
import AddRuleConversation from "../bot/actions/conversations/rule/AddRuleConversation"
import RuleAddButton from "../bot/actions/callback-query/rule/RuleAddButton"
import SaveCommand from "../bot/actions/commands/buckwheat/duelist/SaveCommand"
import CharsCommand from "../bot/actions/commands/buckwheat/duelist/CharsCommand"
import InventoryScrollerButton from "../bot/actions/callback-query/inventory/InventoryScrollerButton"
import InventoryCommand from "../bot/actions/commands/buckwheat/items/InventoryCommand"
import InventoryShowButton from "../bot/actions/callback-query/inventory/InventoryShowButton"
import ReactCommand from "../bot/actions/commands/buckwheat/reaction/ReactCommand"
import ChannelMessageAction from "../bot/actions/message/ChannelMessageAction"
import ShortCommandConditionalCommand from "../bot/actions/commands/conditional/ShortCommandConditionalCommand"
import ShortenCommand from "../bot/actions/commands/buckwheat/short/ShortenCommand"
import ItemUseConversation from "../bot/actions/conversations/item/ItemUseConversation"
import InventoryUseButton from "../bot/actions/callback-query/inventory/InventoryUseButton"
import CookieCommand from "../bot/actions/commands/buckwheat/cookie/CookieCommand"
import TopCommand from "../bot/actions/commands/buckwheat/top/TopCommand"
import TopScrollerButton from "../bot/actions/callback-query/top/TopScrollerButton"
import TopsButtonScrollerButton from "../bot/actions/callback-query/top/TopsButtonScrollerButton"
import GreedBoxCommand from "../bot/actions/commands/buckwheat/greed-box/GreedBoxCommand"
import AvaHistoryScrollerButton from "../bot/actions/callback-query/user/AvaHistoryScrollerButton"
import TogglePublicButton from "../bot/actions/callback-query/chat/TogglePublicButton"
import ShortCommandDeleteButton from "../bot/actions/callback-query/short-command/ShortCommandDeleteButton"
import ShortCommandScrollerButton from "../bot/actions/callback-query/short-command/ShortCommandScrollerButton"
import ShopCommand from "../bot/actions/commands/buckwheat/shop/ShopCommand"
import ShopScrollerButton from "../bot/actions/callback-query/shop/ShopScrollerButton"
import ShopShowButton from "../bot/actions/callback-query/shop/ShopShowButton"
import StatsCommand from "../bot/actions/commands/buckwheat/info/StatsCommand"
import GunSetButton from "../bot/actions/callback-query/gun/GunSetButton"
import ShotCommand from "../bot/actions/commands/buckwheat/gun/ShotCommand"
import ShopBuyButton from "../bot/actions/callback-query/shop/ShopBuyButton"
import SayCommand from "../bot/actions/commands/buckwheat/say/SayCommand"
import SettingBackButton from "../bot/actions/callback-query/settings/SettingBackButton"
import TelegramCommandHandler from "../bot/handlers/message/TelegramCommandHandler"
import StartTelegramCommand from "../bot/actions/commands/telegram/StartTelegramCommand"
import CommandsTelegramCommand from "../bot/actions/commands/telegram/CommandsTelegramCommand"
import SettingsTelegramCommand from "../bot/actions/commands/telegram/SettingsTelegramCommand"
import PaySupportTelegramCommand from "../bot/actions/commands/telegram/PaySupportTelegramCommand"
import MarriageCommand from "../bot/actions/commands/buckwheat/marriage/MarriageCommand"
import HelpTelegramCommand from "../bot/actions/commands/telegram/HelpTelegramCommand"
import MarryCommand from "../bot/actions/commands/buckwheat/marriage/MarryCommand"
import MarryButton from "../bot/actions/callback-query/marriage/MarryButton"
import DivorceCommand from "../bot/actions/commands/buckwheat/marriage/DivorceCommand"
import ExportImportCommand from "../bot/actions/commands/buckwheat/export-import/ExportImportCommand"
import ExportImportScrollerButton from "../bot/actions/callback-query/export-import/ExportImportScrollerButton"
import ExportImportShowButton from "../bot/actions/callback-query/export-import/ExportImportShowButton"
import ExportButton from "../bot/actions/callback-query/export-import/ExportButton"
import ImportButton from "../bot/actions/callback-query/export-import/ImportButton"
import ImportConversation from "../bot/actions/conversations/import/ImportConversation"
import SettingSetButton from "../bot/actions/callback-query/settings/SettingSetButton"
import SetNumberSettingConversation from "../bot/actions/conversations/setting/SetNumberSettingConversation"
import SetStringSettingConversation from "../bot/actions/conversations/setting/SetStringSettingConversation"
import SetDateSettingConversation from "../bot/actions/conversations/setting/SetDateSettingConversation"
import AutoLinkNewChatMemberAction from "../bot/actions/new-chat-member/AutoLinkNewChatMemberAction"
import LinkScrollerButton from "../bot/actions/callback-query/link/LinkScrollerButton"
import LinkButton from "../bot/actions/callback-query/link/LinkButton"
import PaymentHandler from "../bot/handlers/payment/PaymentHandler"
import DonatePaymentAction from "../bot/actions/payment/DonatePaymentAction"
import DonateCommand from "../bot/actions/commands/buckwheat/payment/DonateCommand"
import FaqButton from "../bot/actions/callback-query/faq/FaqButton"
import FaqScrollerButton from "../bot/actions/callback-query/faq/FaqScrollerButton"
import FaqCommand from "../bot/actions/commands/buckwheat/info/FaqCommand"
import UpdateCommand from "../bot/actions/commands/buckwheat/dev/UpdateCommand"
import InventoryGiftButton from "../bot/actions/callback-query/inventory/InventoryGiftButton"
import StopForwardMessageAction from "../bot/actions/message/StopForwardMessageAction"
import ItemGiftConversation from "../bot/actions/conversations/item/ItemGiftConversation"
import JoinChatButton from "../bot/actions/callback-query/new-chat-member/JoinChatButton"
import AntispamMessageAction from "../bot/actions/message/AntispamMessageAction"
import SetTagCommand from "../bot/actions/commands/buckwheat/admin/SetTagCommand"
import SetTagNewChatMemberAction from "../bot/actions/new-chat-member/SetTagNewChatMemberAction"
import ChatJoinRequestButton from "../bot/actions/callback-query/chat-join-request/ChatJoinRequestButton"
import CraftCommand from "../bot/actions/commands/buckwheat/craft/CraftCommand"
import RecipeScrollerButton from "../bot/actions/callback-query/craft/RecipeScrollerButton"
import RecipeShowButton from "../bot/actions/callback-query/craft/RecipeShowButton"
import CraftButton from "../bot/actions/callback-query/craft/CraftButton"
import ProbabilityCommand from "../bot/actions/commands/buckwheat/random/ProbabilityCommand"
import ShortCommandShowButton from "../bot/actions/callback-query/short-command/ShortCommandShowButton"
import GiveAwardConversation from "../bot/actions/conversations/award/GiveAwardConversation"
import GiveAwardCommand from "../bot/actions/commands/buckwheat/award/GiveAwardCommand"
import AwardsCommand from "../bot/actions/commands/buckwheat/award/AwardsCommand"
import AwardDeleteButton from "../bot/actions/callback-query/award/AwardDeleteButton"
import AwardShowButton from "../bot/actions/callback-query/award/AwardShowButton"
import AwardScrollerButton from "../bot/actions/callback-query/award/AwardScrollerButton"
import ChatsCommand from "../bot/actions/commands/buckwheat/chat/ChatsCommand"
import PublicChatLinkButton from "../bot/actions/callback-query/chat/PublicChatLinkButton"
import PublicChatScrollerButton from "../bot/actions/callback-query/chat/PublicChatScrollerButton"
import GeneratorCommand from "../bot/actions/commands/buckwheat/generator/GeneratorCommand"
import GeneratorCollectButton from "../bot/actions/callback-query/generator/GeneratorCollectButton"
import GeneratorAddButton from "../bot/actions/callback-query/generator/GeneratorAddButton"
import GeneratorUpgradeButton from "../bot/actions/callback-query/generator/GeneratorUpgradeButton"
import WipeButton from "../bot/actions/callback-query/wipe/WipeButton"
import WipeCommand from "../bot/actions/commands/buckwheat/admin/WipeCommand"
import MarketCommand from "../bot/actions/commands/buckwheat/market/MarketCommand"
import MarketSlotScrollerButton from "../bot/actions/callback-query/market/MarketSlotScrollerButton"
import MarketShowButton from "../bot/actions/callback-query/market/MarketShowButton"
import MarketSellButton from "../bot/actions/callback-query/market/MarketSellButton"
import MarketSellConversation from "../bot/actions/conversations/market/MarketSellConversation"
import MarketBuyButton from "../bot/actions/callback-query/market/MarketBuyButton"
import MarketDeleteButton from "../bot/actions/callback-query/market/MarketDeleteButton"
import NoteCommand from "../bot/actions/commands/notes/NoteCommand"
import NoteFolderScrollerButton from "../bot/actions/callback-query/notes/NoteFolderScrollerButton"
import NoteScrollerButton from "../bot/actions/callback-query/notes/NoteScrollerButton"
import NoteFolderAddButton from "../bot/actions/callback-query/notes/NoteFolderAddButton"
import NoteFolderAddConversation from "../bot/actions/conversations/notes/NoteFolderAddConversation"
import NoteAddConversation from "../bot/actions/conversations/notes/NoteAddConversation"
import NoteAddButton from "../bot/actions/callback-query/notes/NoteAddButton"
import NoteShowButton from "../bot/actions/callback-query/notes/NoteShowButton"
import NoteFolderDeleteButton from "../bot/actions/callback-query/notes/NoteFolderDeleteButton"
import NoteDeleteButton from "../bot/actions/callback-query/notes/NoteDeleteButton"
import NoteFolderChangePublicButton from "../bot/actions/callback-query/notes/NoteFolderChangePublicButton"
import DeleteUserButton from "../bot/actions/callback-query/delete-user/DeleteUserButton"
import DeleteUserScrollerButton from "../bot/actions/callback-query/delete-user/DeleteUserScrollerButton"
import DeleteUserCommand from "../bot/actions/commands/buckwheat/delete-user/DeleteUserCommand"
import CardCommand from "../bot/actions/commands/buckwheat/card/CardCommand"
import CardCollectionScrollerButton from "../bot/actions/callback-query/card/CardCollectionScrollerButton"
import SuggestCardConversation from "../bot/actions/conversations/card/SuggestCardConversation"
import SuggestCardButton from "../bot/actions/callback-query/card/SuggestCardButton"
import SuggestedCardScrollerButton from "../bot/actions/callback-query/card/SuggestedCardScrollerButton"
import SuggestedCardModerateButton from "../bot/actions/callback-query/card/SuggestedCardModerateButton"
import UnpackCardBoxButton from "../bot/actions/callback-query/card/UnpackCardBoxButton"
import ExchangeCardButton from "../bot/actions/callback-query/card/ExchangeCardButton"
import ShopCardScrollerButton from "../bot/actions/callback-query/card/ShopCardScrollerButton"
import ShopCardBuyButton from "../bot/actions/callback-query/card/ShopCardBuyButton"
import ShopCardSellButton from "../bot/actions/callback-query/card/ShopCardSellButton"
import SellCardConversation from "../bot/actions/conversations/card/SellCardConversation"
import ShopCardListScrollerButton from "../bot/actions/callback-query/card/ShopCardListScrollerButton"
import GunScrollerButton from "../bot/actions/callback-query/gun/GunScrollerButton"
import BusinessCommand from "../bot/actions/commands/buckwheat/business/BusinessCommand"
import NoClassConditionalCommand from "../bot/actions/commands/conditional/NoClassConditionalCommand"
import ShortCommandAddConversation from "../bot/actions/conversations/short-command/ShortCommandAddConversation"
import ShortCommandAddButton from "../bot/actions/callback-query/short-command/ShortCommandAddButton"
import BusinessScrollerButton from "../bot/actions/callback-query/business/BusinessScrollerButton"
import BusinessShowButton from "../bot/actions/callback-query/business/BusinessShowButton"
import BusinessStockSellConversation from "../bot/actions/conversations/business/BusinessStockSellConversation"
import BusinessStockSellButton from "../bot/actions/callback-query/business/BusinessStockSellButton"
import BusinessStockShowButton from "../bot/actions/callback-query/business/BusinessStockShowButton"
import BusinessStockMarketScrollerButton from "../bot/actions/callback-query/business/BusinessStockMarketScrollerButton"
import BusinessStockBuyButton from "../bot/actions/callback-query/business/BusinessStockBuyButton"

export const runBot = async () => {
    const bot = new TelegramBot()

    const simpleCommands = SimpleBuckwheatCommand.from(
        { key: 'simple/agree', name: 'согласен', aliases: ['солидарен'] },
        { key: 'simple/blyad', name: 'блядь', aliases: ['блядина'] },
        { key: 'simple/buckwheat', name: 'баквит', aliases: CommandUtils.botNames.slice(1) },
        { key: 'simple/giveme', name: 'дай', aliases: [] },
        { key: 'simple/go', name: 'иди', aliases: [] },
        { key: 'simple/goyda', name: 'гойда', aliases: [] },
        { key: 'simple/hardworking', name: 'пахать', aliases: ['паши', 'пахай'] },
        { key: 'simple/huli', name: 'хули', aliases: [] },
        { key: 'simple/i', name: 'ъ', aliases: ['ь'] },
        { key: 'simple/meow', name: 'мяу', aliases: ['гав'] },
        { key: 'simple/son', name: 'сын', aliases: ['сынище'] },
        { key: 'simple/suck', name: 'соси', aliases: ['пососи'] },
        { key: 'simple/sucked', name: 'сосал', aliases: ['сосал?'] },
        { key: 'simple/suka', name: 'сука', aliases: [] },
        { key: 'simple/thanks', name: 'спасибо', aliases: ['спасибочки'] },
        { key: 'simple/think', name: 'думай', aliases: ['думать', 'подумать', 'подумай'] },
        { key: 'simple/what', name: 'что', aliases: ['че', 'чё', 'чего'] },
        { key: 'simple/working', name: 'работай', aliases: [] },
        { key: 'simple/gundon', name: 'гандон', aliases: [] },
        { key: 'simple/chaochao', name: 'хаохао', aliases: ['хао-хао'] },
        { key: 'simple/two', name: 'два', aliases: ['2'] },
    )

    bot.add(
        new ConversationHandler()
            .add(
                AddRoleplayConversation,
                EditTextRoleplayConversation,
                AddRuleConversation,
                ItemUseConversation,
                ImportConversation,
                SetNumberSettingConversation,
                SetStringSettingConversation,
                SetDateSettingConversation,
                ItemGiftConversation,
                GiveAwardConversation,
                MarketSellConversation,
                NoteFolderAddConversation,
                NoteAddConversation,
                SuggestCardConversation,
                SellCardConversation,
                ShortCommandAddConversation,
                BusinessStockSellConversation,
            ),

        new CallbackQueryHandler()
            .add(
                SettingScrollerButton,
                SettingShowButton,
                SettingSetButton,
                SettingBackButton,
                CommandsScrollerButton,
                ChangeClassButton,
                AvaHistoryScrollerButton,
                IdeaScrollerButton,
                IdeaVoteButton,
                IdeaDeleteButton,
                OpenRandomPrizeButton,
                CubeStartButton,
                RoleplayAddButton,
                RoleplayChangeCaseButton,
                RoleplayEditTextButton,
                RoleplayScrollerButton,
                RoleplayShowButton,
                RoleplayDeleteButton,
                RuleScrollerButton,
                RuleDeleteButton,
                RuleAddButton,
                ShortCommandScrollerButton,
                ShortCommandDeleteButton,
                ShortCommandShowButton,
                ShortCommandAddButton,
                InventoryScrollerButton,
                InventoryShowButton,
                InventoryUseButton,
                InventoryGiftButton,
                TopScrollerButton,
                TopsButtonScrollerButton,
                TogglePublicButton,
                PublicChatLinkButton,
                PublicChatScrollerButton,
                JoinChatButton,
                ChatJoinRequestButton,
                LinkScrollerButton,
                LinkButton,
                ShopScrollerButton,
                ShopShowButton,
                ShopBuyButton,
                GunSetButton,
                GunScrollerButton,
                MarryButton,
                ExportImportScrollerButton,
                ExportImportShowButton,
                ExportButton,
                ImportButton,
                FaqButton,
                FaqScrollerButton,
                RecipeScrollerButton,
                RecipeShowButton,
                CraftButton,
                AwardDeleteButton,
                AwardShowButton,
                AwardScrollerButton,
                GeneratorCollectButton,
                GeneratorAddButton,
                GeneratorUpgradeButton,
                WipeButton,
                MarketSlotScrollerButton,
                MarketShowButton,
                MarketSellButton,
                MarketBuyButton,
                MarketDeleteButton,
                NoteFolderScrollerButton,
                NoteFolderAddButton,
                NoteFolderDeleteButton,
                NoteFolderChangePublicButton,
                NoteScrollerButton,
                NoteAddButton,
                NoteShowButton,
                NoteDeleteButton,
                DeleteUserButton,
                DeleteUserScrollerButton,
                CardCollectionScrollerButton,
                SuggestCardButton,
                SuggestedCardScrollerButton,
                SuggestedCardModerateButton,
                UnpackCardBoxButton,
                ExchangeCardButton,
                ShopCardScrollerButton,
                ShopCardBuyButton,
                ShopCardSellButton,
                ShopCardListScrollerButton,
                DevButton,
                BusinessScrollerButton,
                BusinessShowButton,
                BusinessStockSellButton,
                BusinessStockShowButton,
                BusinessStockMarketScrollerButton,
                BusinessStockBuyButton,
            ),

        new MessageHandler()
            .add(
                new ChannelMessageAction(),
                new PrivateMessageAction(),
                new CreateProfileAction(),
                new AntispamMessageAction(),
                new NewMessageAction(),
                new ChangeUsernameMessageAction(),
                new ReactionMessageAction(),
                new RandomPrizeMessageAction(),
                new RandomStickerMessageAction(),
                new StopForwardMessageAction(),
            ),

        new NewChatMemberHandler()
            .add(
                new HelloNewChatMemberAction(),
                new AutoLinkNewChatMemberAction(),
                new SetTagNewChatMemberAction()
            ),

        new ConditionalCommandHandler()
            .add(
                new CapsConditionalCommand(),
                new NoClassConditionalCommand(),
                new ShortCommandConditionalCommand(),
                new RoleplayConditionalCommand(),
            ),

        new TelegramCommandHandler()
            .add(
                new StartTelegramCommand(),
                new CommandsTelegramCommand(),
                new SettingsTelegramCommand(),
                new PaySupportTelegramCommand(),
                new HelpTelegramCommand(),
            ),

        new BuckwheatCommandHandler()
            .add(
                ...simpleCommands,
                new DonateCommand(),
                new CommandsCommand(),
                new DevCommand(),
                new SettingCommand(),
                new SetNameCommand(),
                new SetDescriptionCommand(),
                new SetTagCommand(),
                new FaqCommand(),
                new CreatorCommand(),
                new ProfileCommand(),
                new AvaCommand(),
                new LinkCommand(),
                new RuleCommand(),
                new BalanceCommand(),
                new SendMoneyCommand(),
                new MoneyDropCommand(),
                new EchoCommand(),
                new SayCommand(),
                new PingCommand(),
                new UpdateCommand(),
                new RankCommand(),
                new MuteCommand(),
                new UnMuteCommand(),
                new BanCommand(),
                new UnBanCommand(),
                new KickCommand(),
                new DeleteCommand(),
                new DeleteUserCommand(),
                new WipeCommand(),
                new ChatCommand(),
                new ChatsCommand(),
                new MessagesCommand(),
                new PinCommand(),
                new UnpinCommand(),
                new ReactCommand(),
                new WorkCommand(),
                new ShopCommand(),
                new MarketCommand(),
                new InventoryCommand(),
                new CookieCommand(),
                new GreedBoxCommand(),
                new CraftCommand(),
                new CardCommand(),
                new TopCommand(),
                new LevelCommand(),
                new ExperienceCommand(),
                new RoleplayCommand(),
                new SaveCommand(),
                new CharsCommand(),
                new WhomCommand(),
                new ClassCommand(),
                new SummonCommand(),
                new RandomCommand(),
                new RouletteCommand(),
                new ChooseCommand(),
                new CubeCommand(),
                new StickerCommand(),
                new ShotCommand(),
                new HelloCommand(),
                new IdeaCommand(),
                new MarriageCommand(),
                new MarryCommand(),
                new DivorceCommand(),
                new StatsCommand(),
                new GiveAwardCommand(),
                new AwardsCommand(),
                new ExportImportCommand(),
                new ShortenCommand(),
                new ProbabilityCommand(),
                new InfoCommand(),
                new GeneratorCommand(),
                new NoteCommand(),
                new BusinessCommand(),
            ),

        new PhotoActionHandler()
            .add(
                new SetAvaPhotoAction(),
            ),

        new DiceHandler()
            .add(
                new CubeDiceAction(),
                new CasinoDiceAction()
            ),

        new PaymentHandler()
            .add(
                DonatePaymentAction,
            ),

        new BotUseHandler()
            .add(
                new LevelUpUseAction(),
            )
    )

    return bot.run()
}