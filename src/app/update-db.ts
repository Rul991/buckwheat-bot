import { disconnect } from 'mongoose'
import { connectDatabase } from './db'
import IdeasService from '../classes/db/services/ideas/IdeasService'
import IdeasModel from '../classes/db/models/IdeasModel'
import Ideas from '../interfaces/schemas/ideas/Ideas'

const updateIdeas = async () => {
    const ideas = await IdeasModel.findOne() as Ideas
    await IdeasModel.deleteOne()
    for (const idea of ideas.ideas ?? []) {
        await IdeasService.add({
            ...idea,
            owner: idea.id
        })
    }
}

const update = async () => {
    await Promise.allSettled([
        updateIdeas()
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