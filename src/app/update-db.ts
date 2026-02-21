import { disconnect } from 'mongoose'
import { connectDatabase } from './db'

const update = async () => {
    await Promise.allSettled([
        
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