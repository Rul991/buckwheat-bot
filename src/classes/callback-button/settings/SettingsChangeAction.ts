import Setting from '../../../interfaces/other/Setting'
import { ButtonScrollerOptions, ButtonScrollerFullOptions, AsyncOrSync, ButtonScrollerEditMessageResult } from '../../../utils/values/types'
import ButtonScrollerAction from '../scrollers/button/ButtonScrollerAction'

type ButtonScrollerData = {
    c: number
    i: number
}

export default class extends ButtonScrollerAction<Setting[], ButtonScrollerData> {
    
}