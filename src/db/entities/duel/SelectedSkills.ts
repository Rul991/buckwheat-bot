import { prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"

type ConstructorOptions = 
    & Pick<SelectedSkills, 'chatId' | 'id'>
    & Partial<Pick<SelectedSkills, 'skills'>>

export default class SelectedSkills extends ChatIdEntity {
    @prop({ type: [Number] })
    skills: number[]

    constructor({
        chatId,
        id,
        skills = []
    }: ConstructorOptions) {
        super(chatId, id)
        this.skills = skills
    }
}