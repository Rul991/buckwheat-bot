import { disconnect } from 'mongoose'
import MessagesModel from '../classes/db/models/MessagesModel'
import { connectDatabase } from './db'
import ChatModel from '../classes/db/models/ChatModel'
import { CHAT_ID } from '../utils/values/consts'
import CasinoModel from '../classes/db/models/CasinoModel'
import ItemsModel from '../classes/db/models/ItemsModel'
import LevelModel from '../classes/db/models/LevelModel'
import UserModel from '../classes/db/models/UserModel'
import WorkModel from '../classes/db/models/WorkModel'
import LinkedChatModel from '../classes/db/models/LinkedChatModel'
import UserRepository from '../classes/db/repositories/UserRepository'

const updateMessages = async () => {
    await MessagesModel.updateMany(
        { chatId: { $exists: false } }, 
        { $set: { chatId: CHAT_ID } } 
    )

    await MessagesModel.collection.dropIndexes()
}

const updateChats = async () => {
    await ChatModel.updateMany(
        { id: { $exists: false }}, 
        { $set: {id: CHAT_ID} } 
    )
}

const updateCasinos = async () => {
    await CasinoModel.updateMany(
        { chatId: { $exists: false }}, 
        { $set: {chatId: CHAT_ID} } 
    )

    await CasinoModel.collection.dropIndexes()
}

const updateItems = async () => {
    await ItemsModel.updateMany(
        { chatId: { $exists: false } },
        { $set: { chatId: CHAT_ID }}
    )

    await ItemsModel.collection.dropIndexes()
}

const updateLevels = async () => {
    await LevelModel.updateMany(
        { chatId: { $exists: false } },
        { $set: { chatId: CHAT_ID }}
    )

    await LevelModel.collection.dropIndexes()
}

const updateUsers = async () => {
    await UserModel.updateMany(
        { chatId: { $exists: false } },
        { $set: { chatId: CHAT_ID }}
    )

    await UserModel.collection.dropIndexes()
}

const updateWorks = async () => {
    await WorkModel.updateMany(
        { chatId: { $exists: false } },
        { $set: { chatId: CHAT_ID }}
    )

    await WorkModel.collection.dropIndexes()
}

const updateLinkedChats = async () => {
    const users = await UserRepository.findMany()

    for (const user of users) {
        if('linkedChat' in user) {
            const linkedChat = user.linkedChat as number

            await LinkedChatModel.updateOne({id: user.id}, {$set: {linkedChat}})
        }
    }
}

const update = async () => {
    await Promise.allSettled([
        updateMessages(),
        updateChats(),
        updateCasinos(),
        updateItems(),
        updateLevels(),
        updateUsers(),
        updateWorks(),
        updateLinkedChats()
    ])
}

const main = async () => {
    console.log('start connecting')
    await connectDatabase()

    console.log('start updating')
    await update()

    console.log('cool')
    await disconnect()
}

main()