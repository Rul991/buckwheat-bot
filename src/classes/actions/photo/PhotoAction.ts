import { PhotoOptions } from '../../../utils/values/types/action-options'
import ShowableBaseAction from '../base/ShowableBaseAction'

export default abstract class PhotoAction extends ShowableBaseAction {
    abstract execute(options: PhotoOptions): Promise<void> 

    get descriptionType() {
        return 'photo'
    }

    get typeName() {
        return 'Фото 🌇'
    }
}