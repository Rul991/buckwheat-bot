import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import type Item from "../../../utils/items/Item"

type ConstructorOptions =
    & Omit<SelectedGun, '_id'>
    & {
        item?: Item
    }

export default class SelectedGun extends ChatIdEntity {
    @prop()
    selectedGun?: number

    constructor({
        chatId,
        id,
        item
    }: ConstructorOptions) {
        super(chatId, id)
        this.selectedGun = item?.id
    }
}