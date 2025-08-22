import { Context } from 'telegraf'
import BaseAction from '../base/BaseAction'
import { MaybeString, PhotoContext } from '../../../utils/values/types'

export default abstract class PhotoAction extends BaseAction {
    abstract execute(ctx: PhotoContext, other: MaybeString): Promise<void> 
}