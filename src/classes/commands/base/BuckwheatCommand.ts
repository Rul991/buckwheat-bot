import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import ShowableBaseAction from '../../actions/base/ShowableBaseAction'

export default abstract class BuckwheatCommand extends ShowableBaseAction {
    abstract execute(options: BuckwheatCommandOptions): Promise<void>

    get descriptionType() {
        return 'cmd'
    }

    get typeName() {
        return 'Текст 💬'
    }
}