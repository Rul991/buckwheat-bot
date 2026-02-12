import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
import ChooseCommand from '../game/ChooseCommand'

export default class extends ChooseCommand {
    protected _settingId: string = 'word'
    protected _letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
        .split('')
        .join(this._separator)

    constructor() {
        super()
        this._name = 'буква'
        this._description = 'выбирает случайную букву'
        this._aliases = [

        ]
    }

    async execute(options: BuckwheatCommandOptions): Promise<void> {
        super.execute({
            ...options,
            other: this._letters
        })
    }
}