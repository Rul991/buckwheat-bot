import ClassUtils from '../../../../utils/ClassUtils'
import { ClassTypes } from '../../../../utils/values/types'
import BaseUserService from './BaseUserService'

export default class UserClassService {
    static async get(id: number): Promise<ClassTypes> {
        return (await BaseUserService.get<ClassTypes>(id, 'className')) ?? ClassUtils.defaultClassName
    }

    static async update(id: number, type: ClassTypes): Promise<ClassTypes | null> {
        return (await BaseUserService.update(id, 'className', type))
    }
}