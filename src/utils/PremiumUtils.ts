import Chat from '../interfaces/schemas/chat/Chat'
import { CHAT_ID } from './values/consts'

export default class {
    static isPremium({id, premiumUntilDate}: Chat): boolean {
        return (CHAT_ID == id) || (premiumUntilDate !== undefined && premiumUntilDate >= Date.now())
    }
}