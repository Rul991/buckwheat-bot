import BaseAction from '../base/BaseAction'
import { PhotoOptions } from '../../../utils/values/types/action-options'

export default abstract class PhotoAction extends BaseAction {
    abstract execute(options: PhotoOptions): Promise<void> 
}