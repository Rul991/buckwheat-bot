import DataCommand from './DataCommand'

export default class extends DataCommand {
    constructor() {
        super()
        this._name = 'импорт'
        this._description = 'позволяю импортировать некоторые данные\nиспользуется парно с "баквит экспорт"'
        this._filename = 'import'
    }
}