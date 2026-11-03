import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type SkillAddScrollerButtonData, SkillAddScrollerButtonDataSchema, SkillShowType } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type Skill from "../../../../utils/duel/skill/Skill"
import { characters } from "../../../../resources/duels/characters/characters"
import SelectedSkillsMenuButton from "./SelectedSkillsMenuButton"
import ExperienceUtils from "../../../../utils/level/ExperienceUtils"
import SkillShowButton from "./SkillShowButton"
import ClassUtils from "../../../../utils/db/ClassUtils"

type Object = Skill
type ScrollerData = SkillAddScrollerButtonData

class SkillAddScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = SkillAddScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 183
    override name: string = 'skaddscr'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            ctx
        } = options
        const user = await ctx.vars.user.require()
        const className = user.className

        if(!ClassUtils.isPlayer(className)) return []
        return characters[className].getSkills()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: skills,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)
        const levelObject = await ctx.vars.level.get()
        const level = ExperienceUtils.getLevelFromObject(levelObject)

        for (const skill of skills) {
            const style = level < skill.level ? 'danger' : undefined
            keyboard.add(
                SkillShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        skillId: skill.id,
                        page,
                        type: SkillShowType.Add
                    },
                    style,
                    vars: {
                        title: skill.getTitle(ctx)
                    }
                })
            )
        }

        keyboard.add(
            SelectedSkillsMenuButton.button({
                ctx,
                data: {
                    id: bigId
                },
                key: 'button/back'
            })
        )

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            
        } = options

        return {
            key: 'skills/message/add/list',
        }
    }
}

export default new SkillAddScrollerButton()