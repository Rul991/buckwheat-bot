import { FIRST_INDEX, NOT_FOUND_INDEX } from './values/consts'
import { CallbackButtonValue, CreateNavButtonsOptions, GetPageNavOptions } from './values/types/types'

type GetArrowsOptions = GetPageNavOptions & {
    start: number
    end: number
}

export default class {
    static createNavButton({
        text,
        increase: { name: increase, value: increaseValue },
        current: { name: current, value: currentValue },
        id
    }: CreateNavButtonsOptions): CallbackButtonValue {
        return {
            text,
            data: JSON.stringify({
                [current]: currentValue,
                [increase]: increaseValue,
                ...(id ? {[id.name as string]: id.value} : {})
            })
        }
    }

    static getPageNav({
        length,
        buttonsPerPage,
        pageIndex,
        id,
        current,
        increase,
        createNavButton = this.createNavButton
    }: GetPageNavOptions): CallbackButtonValue[] {
        if(!length) {
            return [
                {
                    text: '(пусто)',
                    data: '@'
                }
            ]
        }
        const pageNav: CallbackButtonValue[] = []

        const lastPage = Math.ceil(
            length / buttonsPerPage
        )
        const lastPageIndex = lastPage - 1
        const needEdgeButtons = lastPageIndex > 1
        const currentPage = pageIndex + 1

        if(needEdgeButtons && pageIndex > FIRST_INDEX) {
            pageNav.push(createNavButton({
                text: `1`,
                current: {
                    name: current,
                    value: NOT_FOUND_INDEX
                },
                increase: {
                    name: increase,
                    value: 1
                },
                id
            }))
        }

        pageNav.push(createNavButton({
            text: `${currentPage} / ${lastPage}`,
            current: {
                name: '@',
                value: 1
            },
            increase: {
                name: '@',
                value: 1
            }
        }))

        if(needEdgeButtons && pageIndex < lastPageIndex) {
            pageNav.push(createNavButton({
                text: `${lastPage}`,
                current: {
                    name: current,
                    value: lastPage
                },
                increase: {
                    name: increase,
                    value: -1
                },
                id
            }))
        }

        return pageNav
    }

    static getArrows({
        length,
        start,
        end,
        pageIndex,
        id,
        current,
        increase,
        createNavButton = this.createNavButton
    }: GetArrowsOptions) {
        const arrows: CallbackButtonValue[] = []

        const addArrow = (onLeft: boolean) => {
            arrows.push(createNavButton({
                text: onLeft ? '<<' : '>>',
                current: {
                    name: current,
                    value: pageIndex
                },
                increase: {
                    name: increase,
                    value: onLeft ? -1 : 1
                },
                id
            }))
        }

        if(start > FIRST_INDEX) {
            addArrow(true)
        }

        if(end < length) {
            addArrow(false)
        }

        return arrows
    }
}