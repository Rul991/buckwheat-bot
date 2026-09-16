import { DEFAULT_REACT_EMOJI, REACT_EMOJIES } from "../../consts/texts"
import { SettingValueTypes } from "../../protos/settings_pb"
import Setting from "../../utils/settings/Setting"

export const grindSetting = new Setting({
    id: 0,
    textKey: 'grind',
    type: 'boolean',
    properties: {},
    default: false,
    valueType: SettingValueTypes.User,
})

export const pingEmojiSetting = new Setting({
    id: 1,
    textKey: 'emoji/ping',
    type: 'enum',
    properties: {
        values: REACT_EMOJIES
    },
    default: DEFAULT_REACT_EMOJI,
    valueType: SettingValueTypes.User,
})

export const summonEmojiSetting = new Setting({
    id: 2,
    textKey: 'emoji/summon',
    type: 'enum',
    properties: {
        values: [...REACT_EMOJIES, '']
    },
    default: '',
    valueType: SettingValueTypes.User,
})

export const notesPublicSetting = new Setting({
    id: 3,
    textKey: 'notes-public',
    type: 'boolean',
    properties: {},
    default: false,
    valueType: SettingValueTypes.User,
})

export const autolinkSetting = new Setting({
    id: 4,
    textKey: 'autolink',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.User,
})

export const userSettings = [
    grindSetting,
    pingEmojiSetting,
    summonEmojiSetting,
    notesPublicSetting,
    autolinkSetting,
]