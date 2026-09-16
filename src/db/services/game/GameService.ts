import type { BotContext } from "../../../types/bot"
import type { TopValues } from "../../../types/top"
import MessageUtils from "../../../utils/bot/MessageUtils"
import Game from "../../entities/game/Game"
import BaseService from "../base/BaseService"

type BaseOptions = {
    chatId: number
    id: number
    type: string
}

type StopGameOptions =
    & BaseOptions
    & {
        key: 'wins' | 'loses'
    }

type StartGameOptions =
    & BaseOptions
    & {
        messageId?: number
    }

type DeleteLastMessageOptions =
    & BaseOptions
    & {
        ctx: BotContext
    }

class GameService extends BaseService<typeof Game> {
    constructor() {
        super(Game)
    }

    async get({
        chatId,
        id,
        type
    }: BaseOptions): Promise<Game> {
        const filter = {
            chatId,
            id,
            type
        }
        return this._repo.getOrCreate(
            filter,
            new Game(filter)
        )
    }

    private async _stopGame({
        chatId,
        id,
        key,
        type
    }: StopGameOptions): Promise<Game | undefined> {
        return await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id,
                type
            },
            {
                onGame: false,
                $inc: {
                    [key]: 1,
                    [key == 'loses' ? 'wins' : 'loses']: 0
                }
            },
            {
                lean: true,
                upsert: true,
                returnDocument: 'after'
            }
        ) ?? undefined
    }

    async win(options: BaseOptions): Promise<Game | undefined> {
        return this._stopGame({
            ...options,
            key: 'wins'
        })
    }

    async lose(options: BaseOptions): Promise<Game | undefined> {
        return this._stopGame({
            ...options,
            key: 'loses'
        })
    }

    async start({
        chatId,
        id,
        type,
        messageId,
    }: StartGameOptions): Promise<Game | undefined> {
        return this._repo.updateOne(
            {
                chatId,
                id,
                type
            },
            {
                onGame: true,
                lastMessage: messageId
            }
        )
    }

    async deleteMessage(options: DeleteLastMessageOptions): Promise<boolean> {
        const {
            ctx,
        } = options
        const game = await this.get(options)
        const lastMessage = game.lastMessage
        if (!lastMessage) return false

        return await MessageUtils.deleteMessages(
            ctx,
            lastMessage
        )
    }

    async onGame(options: BaseOptions): Promise<boolean> {
        const game = await this.get(options)
        return game.onGame
    }

    async getAllByUser(chatId: number, id: number): Promise<Game[]> {
        return this._repo.find({
            chatId,
            id
        })
    }

    async getUnsortedTopValues(chatId: number, type: string): Promise<TopValues[]> {
        const games = await this._repo.find({ chatId, type })
        return games
            .filter(v => v.wins > 0)
            .map(v => {
                return {
                    id: v.id,
                    value: v.wins
                }
            })
    }
}

export default new GameService()