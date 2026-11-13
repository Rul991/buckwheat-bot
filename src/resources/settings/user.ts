import { DEFAULT_REACT_EMOJI, DESCRIPTION_PROFILE_PLACE_EMOJI, PLAYER_PROFILE_PLACE_EMOJI, REACT_EMOJIES } from "../../consts/texts"
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
    textKey: 'notes/public',
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

export const noteEmojiesSetting = new Setting({
    id: 5,
    textKey: 'notes/emojies',
    type: 'string',
    properties: {
        min: 1,
        max: 16
    },
    default: '📄📜📰',
    valueType: SettingValueTypes.User
})

export const summonEmojiPlaceSetting = new Setting({
    id: 6,
    textKey: 'summon/emoji-place',
    type: 'enum',
    properties: {
        values: [
            DESCRIPTION_PROFILE_PLACE_EMOJI,
            PLAYER_PROFILE_PLACE_EMOJI,
        ]
    },
    default: DESCRIPTION_PROFILE_PLACE_EMOJI,
    valueType: SettingValueTypes.User,
    vars: {
        emoji: {
            description: DESCRIPTION_PROFILE_PLACE_EMOJI,
            player: PLAYER_PROFILE_PLACE_EMOJI
        }
    }
})

export const userSettings = [
    grindSetting,
    pingEmojiSetting,
    summonEmojiSetting,
    notesPublicSetting,
    autolinkSetting,
    noteEmojiesSetting,
    summonEmojiPlaceSetting,
]