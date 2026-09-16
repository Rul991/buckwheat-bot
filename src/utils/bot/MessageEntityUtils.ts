import type { Message, MessageEntity } from "grammy/types"
import StringUtils from "../string/StringUtils"
import Logger from "../logs/Logger"
import format, { htmlFormatters, type FormatterFn } from "telegram-transformer"

type EntityByType = {
    [T in MessageEntity as T['type']]: T
}

type FormattersDict = {
    [T in keyof EntityByType]: FormatterFn<EntityByType[T]>
}

export default class MessageEntityUtils {
    //@ts-ignore
    private static _htmlFormatters: FormattersDict = {
        ...htmlFormatters,
        spoiler: (entityText) => {
            return {
                text: entityText,
                before: '<span class="tg-spoiler">',
                after: '</span>'
            }
        },
        blockquote: (entityText) => {
            return {
                text: entityText,
                before: '<blockquote>',
                after: '</blockquote>'
            }
        },
        expandable_blockquote: (entityText) => {
            return {
                text: entityText,
                before: '<blockquote expandable>',
                after: '</blockquote>'
            }
        },
        date_time: (entityText, entity) => {
            return {
                text: entityText,
                after: '</tg-time>',
                before: `<tg-time unix="${entity.unix_time}" format="${entity.date_time_format}">`,
            }
        },
        mention: (entityText) => {
            return {
                text: entityText,
                after: '',
                before: ''
            }
        }
    }

    static getOtherEntitiesAndText(text: string, entities: MessageEntity[], endIndex = 1): [string, MessageEntity[]] {
        const noBotNameAndCommand = endIndex == -1
        const words = noBotNameAndCommand ? [] : StringUtils.splitByCommands(text, endIndex + 1)
        const botNameAndCommand = noBotNameAndCommand ? '' : words.slice(0, endIndex).join(' ')
        const other = noBotNameAndCommand ? text : words[endIndex + 1] ?? ''

        const searchStart = botNameAndCommand.length
        const startIndex = text.indexOf(other, searchStart)

        if (startIndex === -1 || !other) {
            return [other || '', []]
        }

        const otherEntities: MessageEntity[] = []

        for (const entity of entities) {
            const entityStart = entity.offset
            const entityEnd = entity.offset + entity.length

            if (entityStart >= startIndex && entityEnd <= startIndex + other.length) {
                const shiftedEntity = {
                    ...entity,
                    offset: entityStart - startIndex
                }
                otherEntities.push(shiftedEntity)
            }
            else if (entityStart < startIndex && entityEnd > startIndex && entityEnd <= startIndex + other.length) {
                const newLength = entityEnd - startIndex
                const shiftedEntity = {
                    ...entity,
                    offset: 0,
                    length: newLength
                }
                otherEntities.push(shiftedEntity)
            }
            else if (entityStart >= startIndex && entityStart < startIndex + other.length && entityEnd > startIndex + other.length) {
                const newLength = startIndex + other.length - entityStart
                const shiftedEntity = {
                    ...entity,
                    offset: entityStart - startIndex,
                    length: newLength
                }
                otherEntities.push(shiftedEntity)
            }
        }

        otherEntities.sort((a, b) => a.offset - b.offset)
        return [other, otherEntities]
    }

    static entitiesToHtml(other: string, otherEntities: MessageEntity[]): string {
        const htmlFormatters = this._htmlFormatters
        const result = format(
            other,
            otherEntities as any,
            {
                formatters: htmlFormatters
            }
        )

        Logger.debug(
            'MessageEntityUtils.entitiesToHtml',
            {
                result,
                other,
                otherEntities,
                htmlFormatters
            }
        )
        return result.text
    }

    static messageToHtml(message: Message, endIndex?: number): string {
        const entities = message.entities ?? message.caption_entities ?? []
        const text = message.text ?? message.caption ?? ''
        const [other, otherEntities] = this.getOtherEntitiesAndText(text, entities, endIndex)

        return this.entitiesToHtml(other, otherEntities)
    }
}