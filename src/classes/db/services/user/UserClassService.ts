import ClassUtils from '../../../../utils/ClassUtils'
import { ClassTypes } from '../../../../utils/values/types'
import BaseUserService from './BaseUserService'

export default class UserClassService {
    static async get(chatId: number, id: number): Promise<ClassTypes> {
        return (await BaseUserService.get<ClassTypes>(chatId, id, 'className')) ?? ClassUtils.defaultClassName
    }

    static async update(chatId: number, id: number, type: ClassTypes): Promise<ClassTypes | null> {
        return (await BaseUserService.update(chatId, id, 'className', type))
    }
}