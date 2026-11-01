import DuelistService from "../../../../db/services/duel/DuelistService"
import type { MethodGetDataOptions, MethodPreCheckOptions, MethodExecuteOptions } from "../../../../types/skill-methods"
import SkillMethod from "../base/SkillMethod"

export default abstract class BaseManaMethod extends SkillMethod {
    protected abstract _getRawMana(options: MethodGetDataOptions): Promise<number>
    
        protected override async _getData(options: MethodGetDataOptions): Promise<number> {
            const mana = await this._getRawMana(options)
            const {
                boost
            } = options

            if(mana < 0) {
                return Math.floor(mana)
            }

            return Math.floor(mana * boost)
        }
    
        protected override async _precheck(options: MethodPreCheckOptions): Promise<boolean> {
            const {
                target,
                data: needMana
            } = options
            const duelist = await target.duelist.require()
            const mana = duelist.mana

            return mana >= -needMana
        }
    
        protected override async _execute(options: MethodExecuteOptions): Promise<void> {
            const {
                data,
                chatId,
                target,
            } = options
            
            if(data == 0) return
            target.duelist.set(
                await DuelistService.add({
                    chatId,
                    id: target.id,
                    value: data,
                    key: 'mana'
                })
            )
        }
    
}