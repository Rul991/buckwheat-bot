import { AUTO_ALLOW_JOIN_REQUEST_SYMBOL, SEND_MESSAGE_JOIN_REQUEST_SYMBOL, DO_NOTHING_JOIN_REQUEST_SYMBOL } from "../../consts/texts"
import { MILLISECONDS_IN_SECOND, MILLISECONDS_IN_YEAR } from "../../consts/time"
import { SettingValueTypes } from "../../protos/settings_pb"
import Setting from "../../utils/settings/Setting"

export const reactChanceSetting = new Setting({
    id: 0,
    textKey: 'chance/react',
    type: 'number',
    properties: {
        min: 0,
        max: 100
    },
    default: 1,
    valueType: SettingValueTypes.Chat,
})

export const diceAnswerChanceSetting = new Setting({
    id: 1,
    textKey: 'chance/dice',
    type: 'number',
    properties: {
        min: 0,
        max: 100
    },
    default: 15,
    valueType: SettingValueTypes.Chat,
})

export const messagePerTimeSetting = new Setting({
    id: 2,
    textKey: 'antispam/message',
    type: 'number',
    properties: {
        min: 1,
        max: 1000
    },
    default: 7,
    valueType: SettingValueTypes.Chat,
})

export const notSpamTimeSetting = new Setting({
    id: 3,
    textKey: 'antispam/time',
    type: 'date',
    properties: {
        min: MILLISECONDS_IN_SECOND,
        max: MILLISECONDS_IN_YEAR
    },
    default: 14 * MILLISECONDS_IN_SECOND,
    valueType: SettingValueTypes.Chat,
})

export const antiSpamMuteSetting = new Setting({
    id: 4,
    textKey: 'antispam/mute',
    type: 'date',
    properties: {
        min: MILLISECONDS_IN_SECOND,
        max: MILLISECONDS_IN_YEAR
    },
    default: 14 * MILLISECONDS_IN_SECOND,
    valueType: SettingValueTypes.Chat,
})

export const spawnBoxSetting = new Setting({
    id: 7,
    textKey: 'spawn-box',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.Chat,
})

export const hasHelloButtonSetting = new Setting({
    id: 8,
    textKey: 'old-check',
    type: 'boolean',
    properties: {},
    default: false,
    valueType: SettingValueTypes.Chat,
})

export const canBuyUnmuteSetting = new Setting({
    id: 10,
    textKey: 'can/buy-unmute',
    type: 'boolean',
    properties: {},
    default: false,
    valueType: SettingValueTypes.Chat,
})

export const negativeRankSetting = new Setting({
    id: 11,
    textKey: 'negative-rank',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.Chat,
})

export const wrongCommandReactSetting = new Setting({
    id: 13,
    textKey: 'command/wrong',
    type: 'boolean',
    properties: {},
    default: false,
    valueType: SettingValueTypes.Chat,
})

export const showRankInTopSetting = new Setting({
    id: 14,
    textKey: 'command/top',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.Chat,
})

export const gameKickSetting = new Setting({
    id: 15,
    textKey: 'kick/game',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.Chat,
})

export const kickPvpSetting = new Setting({
    id: 16,
    textKey: 'kick/pvp',
    type: 'boolean',
    properties: {},
    default: true,
    valueType: SettingValueTypes.Chat,
})

export const autoJoinSetting = new Setting({
    id: 17,
    textKey: 'auto-join',
    type: 'enum',
    properties: {
        values: [
            AUTO_ALLOW_JOIN_REQUEST_SYMBOL,
            SEND_MESSAGE_JOIN_REQUEST_SYMBOL,
            DO_NOTHING_JOIN_REQUEST_SYMBOL,
        ]
    },
    default: SEND_MESSAGE_JOIN_REQUEST_SYMBOL,
    valueType: SettingValueTypes.Chat,
})

export const stickerChanceSetting = new Setting({
    id: 18,
    textKey: 'chance/sticker',
    type: 'number',
    properties: {
        min: 0,
        max: 100
    },
    default: 1,
    valueType: SettingValueTypes.Chat,
})

export const chatSettings = [
    reactChanceSetting,
    diceAnswerChanceSetting,
    messagePerTimeSetting,
    notSpamTimeSetting,
    antiSpamMuteSetting,
    spawnBoxSetting,
    hasHelloButtonSetting,
    canBuyUnmuteSetting,
    negativeRankSetting,
    wrongCommandReactSetting,
    showRankInTopSetting,
    gameKickSetting,
    kickPvpSetting,
    autoJoinSetting,
    stickerChanceSetting,
]