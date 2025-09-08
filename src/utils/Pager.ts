import MathUtils from './MathUtils'

export default class Pager {
    private static _getPageAndIncrease(data: string): [number, number] {
        return data
            .split('_', 2)
            .map(val => +val) as [number, number]
    }

    static wrapPages(data: string, length: number): number {
        if(!length) return -1
        
        const [addedValue, prevPage] = this._getPageAndIncrease(data)
        const newPage = prevPage + addedValue
        const resultPage = MathUtils.wrap(newPage, 0, length - 1)

        if(prevPage == resultPage) {
            return -1
        }
        else {
            return resultPage
        }
    }
}