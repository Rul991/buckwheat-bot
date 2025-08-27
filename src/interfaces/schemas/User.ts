import { ClassTypes } from '../../utils/values/types'

export default interface User {
    id: number
    name: string
    rank?: number
    description?: string
    imageId?: string
    className?: ClassTypes
    isOld?: boolean
    linkedChat?: number
    isLeft?: boolean
}