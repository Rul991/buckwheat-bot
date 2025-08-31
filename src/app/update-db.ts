import { disconnect } from 'mongoose'
import MessagesModel from '../classes/db/models/MessagesModel'
import { connectDatabase } from './db'
import ChatModel from '../classes/db/models/ChatModel'
import { CHAT_ID } from '../utils/values/consts'

const updateMessages = async () => {
    await MessagesModel.updateMany(
        { firstMessage: { $exists: false } }, 
        { $set: { firstMessage: Date.now() } } 
    )
}

const updateChat = async () => {
    await ChatModel.updateMany(
        { 'equals': {id: 0}}, 
        { id: CHAT_ID } 
    )
}

const update = async () => {
    await Promise.allSettled(
        [
            // updateMessages(),
            updateChat()
        ]
    )
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