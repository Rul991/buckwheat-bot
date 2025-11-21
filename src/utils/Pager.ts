import MathUtils from './MathUtils'
import { FIRST_INDEX, NOT_FOUND_INDEX } from './values/consts'

export default class Pager {
    private static _getPageAndIncrease(data: string): [number, number] {
        return data
            .split('_', 2)
            .map(val => +val) as [number, number]
    }

    static wrapPages(data: string, length: number): number {
        if(!length) return NOT_FOUND_INDEX
        
        const [addedValue, prevPage] = this._getPageAndIncrease(data)
        const newPage = prevPage + addedValue
        const resultPage = MathUtils.wrap(newPage, FIRST_INDEX, length - 1)

        if(prevPage == resultPage) {
            return NOT_FOUND_INDEX
        }
        else {
            return resultPage
        }
    }
}