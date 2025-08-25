import { disconnect } from 'mongoose'
import MessagesModel from '../classes/db/models/MessagesModel'
import { connectDatabase } from './db'

const updateMessages = async () => {
    await MessagesModel.updateMany(
        { firstMessage: { $exists: false } }, 
        { $set: { firstMessage: Date.now() } } 
    )
}

const update = async () => {
    await Promise.allSettled(
        [
            updateMessages()
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