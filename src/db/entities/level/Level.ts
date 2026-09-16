import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import ExperienceUtils from "../../../utils/level/ExperienceUtils"

export default class Level extends ChatIdEntity {
    @prop({
        min: ExperienceUtils.min,
        max: ExperienceUtils.max,
    })
    currentExperience: number = 0
    
    @prop({
        min: ExperienceUtils.min,
        max: ExperienceUtils.max,
    })
    prevExperience: number = 0

    @prop()
    isLevelUpChecked: boolean

    constructor({
        chatId,
        id,
    }: Pick<Level, 'chatId' | 'id'>) {
        super(chatId, id)
        this.isLevelUpChecked = true
    }
}