import { disconnect } from 'mongoose'
import { connectDatabase } from './db'
import CubeModel from '../classes/db/models/CubeModel'

const updateCubePlaying = async () => {
    await CubeModel.updateMany(
        {}, 
        {
            $set: { isNeedPlaying: false }
        })
}

const update = async () => {
    await Promise.allSettled([
        updateCubePlaying()
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