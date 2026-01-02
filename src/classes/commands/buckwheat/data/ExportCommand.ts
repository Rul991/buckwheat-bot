import DataCommand from './DataCommand'

export default class extends DataCommand {
    constructor() {
        super()
        this._name = 'экспорт'
        this._description = 'позволяю экспортировать некоторые данные из чата\nиспользуется парно с "баквит импорт"'
        this._filename = 'export'
    }
}