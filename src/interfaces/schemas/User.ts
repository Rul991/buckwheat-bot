import { ClassTypes } from '../../utils/types'

export default interface User {
    id: number
    name: string
    rank?: number
    description?: string
    imageId?: string
    className?: ClassTypes
    isOld?: boolean
}