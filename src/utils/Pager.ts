export default class Pager {
    private static _getPageAndIncrease(data: string): [number, number] {
        return data
            .split('_', 2)
            .map(val => +val) as [number, number]
    }

    static clampPages(data: string, length: number): number {
        if(!length) return -1
        
        const [addedValue, prevPage] = this._getPageAndIncrease(data)
        const newPage = prevPage + addedValue
        let resultPage = newPage

        if(resultPage < 0) {
            resultPage = length - 1
        }
        else if(resultPage >= length) {
            resultPage = 0
        }

        if(prevPage == resultPage) {
            return -1
        }
        else {
            return resultPage
        }
    }
}