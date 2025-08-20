import IdeasRepository from '../../repositories/IdeasRepository'
import Ideas from '../../../../interfaces/schemas/Ideas'
import Idea from '../../../../interfaces/schemas/Idea'
import { AsyncOrSync } from '../../../../utils/types'

export default class IdeasService {
    private static async _update(callback: (ideas: Idea[]) => AsyncOrSync<Idea[]>): Promise<Ideas | null> {
        const ideas = await this.getIdeas()
        const newIdeas = await callback(ideas)

        return await IdeasRepository.updateOne({ideas: newIdeas})
    }

    static async get(): Promise<Ideas> {
        const foundIdeas = await IdeasRepository.findOne()
        if(!foundIdeas) return await IdeasRepository.create({})
        else return foundIdeas
    }

    static async getIdeas(): Promise<Idea[]> {
        const ideas = await this.get()
        return ideas.ideas ?? []
    }

    static async getIdea(index: number): Promise<Idea | null> {
        return (await this.getIdeas())[index]
    }

    static async add(idea: Idea): Promise<Ideas | null> {
        return await this._update(ideas => {
            idea.createdAtTime = Date.now()
            ideas.push(idea)
            return ideas
        })
    }

    static async delete(number: number): Promise<Ideas | null> {
        return await this._update(ideas => {
            ideas.splice(number, 1)
            return ideas
        })
    }

    static async update(number: number, data: Partial<Idea>): Promise<Ideas | null> {
        return await this._update(ideas => {
            const idea = ideas[number]

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    //@ts-ignore
                    const value = data[key] as Idea[keyof Idea]
                    if(value === undefined) continue

                    //@ts-ignore
                    ideas[number][key] = value
                }
            }

            return ideas
        })
    }
}