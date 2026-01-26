import MarketShowAction from '../base/MarketShowAction'

export default class extends MarketShowAction {
    protected _folder: string = 'buy'

    constructor() {
        super()
        this._buttonTitle = 'Рынок: Просмотр покупки'
        this._name = 'marketbuyshow'
    }
}