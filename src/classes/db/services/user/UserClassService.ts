import ClassUtils from '../../../../utils/ClassUtils'
import { ClassTypes } from '../../../../utils/values/types/types'
import BaseUserService from './BaseUserService'

export default class UserClassService {
    static async get(chatId: number, id: number): Promise<ClassTypes> {
        return (await BaseUserService.get(chatId, id, 'className')) ?? ClassUtils.defaultClassName
    }

    static async update(chatId: number, id: number, type: ClassTypes): Promise<ClassTypes | null> {
        return (await BaseUserService.update(chatId, id, 'className', type)) ?? null
    }
    
    static async isPlayer(chatId: number, id: number): Promise<boolean> {
        const playerType =  await this.get(chatId, id)
        return ClassUtils.isPlayer(playerType)
    }

    static async has(chatId: number, id: number, needClass: ClassTypes) {
        const className = await this.get(chatId, id)
        return className == needClass
    }
}