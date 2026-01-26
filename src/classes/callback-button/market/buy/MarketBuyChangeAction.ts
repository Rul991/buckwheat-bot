import MarketChangeAction from '../base/MarketChangeAction'

export default class extends MarketChangeAction {
    constructor() {
        super()
        this._name = 'marketbuychange'
        this._buttonTitle = 'Рынок: Пролистывание покупок'
        this._filename = 'market/buy/change'
    }
}