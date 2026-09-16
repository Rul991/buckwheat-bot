import { SAVE_COOLDOWN } from "../../consts/time"
import type Duelist from "../../db/entities/duel/Duelist"
import type { CanSaveDuelistResult } from "../../types/duels"
import Logger from "../logs/Logger"
import TimeUtils from "../time/TimeUtils"

export default class DuelistUtils {
    static canSave(duelist: Duelist | undefined): CanSaveDuelistResult {
        if(!duelist) return {
            isCan: false,
            remainingTime: 0
        }

        const lastSave = +duelist.lastSave
        const elapsedTime = TimeUtils.getElapsed(lastSave)
        const isCan = TimeUtils.isExpired(
            lastSave,
            SAVE_COOLDOWN
        )

        const result = {
            isCan,
            remainingTime: SAVE_COOLDOWN - elapsedTime
        }

        Logger.debug(
            'DuelistUtils.canSave',
            {
                result,
                duelist
            }
        )
        return result
    }
}