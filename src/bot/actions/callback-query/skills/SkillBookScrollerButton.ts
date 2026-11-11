import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type SkillBookScrollerButtonData, SkillBookScrollerButtonDataSchema, SkillBookScrollerType, SkillShowType } from "../../../../protos/skills_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type Skill from "../../../../utils/duel/skill/Skill"
import { effects } from "../../../../resources/duels/skills/effects"
import type { ClassTypes } from "../../../../types/class"
import { characters } from "../../../../resources/duels/characters/characters"
import SkillShowButton from "./SkillShowButton"
import SkillBookMenuButton from "./SkillBookMenuButton"

type Object = Skill
type ScrollerData = SkillBookScrollerButtonData

class SkillBookScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = SkillBookScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 187
    override name: string = 'skbscr'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 5

    private _scrollerTypeToClassNameDict: Record<SkillBookScrollerType, ClassTypes> = {
        [SkillBookScrollerType.Knight]: "knight",
        [SkillBookScrollerType.Thief]: "thief",
        [SkillBookScrollerType.Sorcerer]: "sorcerer",
        [SkillBookScrollerType.Engineer]: "engineer",
        [SkillBookScrollerType.Bard]: "bard",
        [SkillBookScrollerType.Effect]: "boss"
    }

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<Skill, SkillBookScrollerButtonData>): Promise<Omit<SkillBookScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        const {
            type
        } = options.data

        return {
            type
        }
    }
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            data
        } = options

        const {
            type
        } = data
        
        if(type == SkillBookScrollerType.Effect) {
            return effects
        }
        
        const className = this._scrollerTypeToClassNameDict[type]
        const character = characters[className]
        return character.getSkills()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: skills,
            ctx,
            id,
            page,
            data: {
                type
            }
        } = options
        const bigId = BigInt(id)

        for (const skill of skills) {
            keyboard.add(
                SkillShowButton.button({
                    ctx,
                    vars: {
                        title: skill.getTitle(ctx)
                    },
                    data: {
                        id: bigId,
                        skillId: skill.id,
                        page,
                        type: SkillShowType.Book,
                        scrollerType: type
                    }
                })
            )
        }

        keyboard.add(
            SkillBookMenuButton.button({
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
            data
        } = options
        const {
            type
        } = data

        return {
            key: 'skills/message/book/menu',
            vars: {
                type
            }
        }
    }
}

export default new SkillBookScrollerButton()