import { GREED_BOX_LEAVE_CHANCE } from "../../consts/chances"
import { GREED_BOX_PRIZE, MAX_GREED_BOX_PRIZE } from "../../consts/number"
import { COOKIE_TIME } from "../../consts/time"
import DuelistService from "../../db/services/duel/DuelistService"
import GreedBoxService from "../../db/services/greed-box/GreedBoxService"
import InventoryItemService from "../../db/services/items/InventoryItemService"
import BalanceService from "../../db/services/money/BalanceService"
import UserClassService from "../../db/services/user/UserClassService"
import WorkService from "../../db/services/work/WorkService"
import AdminUtils from "../../utils/bot/AdminUtils"
import MessageUtils from "../../utils/bot/MessageUtils"
import ClassUtils from "../../utils/db/ClassUtils"
import GrindUtils from "../../utils/grind/GrindUtils"
import Item from "../../utils/items/Item"
import Logger from "../../utils/logs/Logger"
import RandomUtils from "../../utils/math/RandomUtils"
import ShieldUtils from "../../utils/shield/ShieldUtils"

export const businessPaperItem = new Item({
    id: 0,
    key: 'business/paper',
    basePrice: 100_000,
    isConsumable: true,
    emoji: 'book'
})

export const cookieItem = new Item({
    id: 1,
    key: 'other/cookie',
    isConsumable: true,
    basePrice: 13,
    emoji: 'cookie',
    callbacks: {
        use: async ({
            ctx,
            chatId,
            id,
            count
        }) => {
            const user = await ctx.vars.user.get()
            const isSendMessage = await GrindUtils.isSendMessage(ctx, id)
            await Promise.allSettled([
                isSendMessage && MessageUtils.reply(
                    ctx,
                    'cookie/eat',
                    {
                        vars: {
                            user,
                            count
                        }
                    }
                ),
                WorkService.skip(
                    chatId,
                    id,
                    COOKIE_TIME * count
                )
            ])
        }
    }
})

export const corporationItem = new Item({
    id: 2,
    key: 'business/corporation',
    isConsumable: true,
    basePrice: 500_000,
    emoji: 'book'
})

export const craftWorkUpItem = new Item({
    id: 3,
    key: 'work/craft-boost',
    isConsumable: false,
    basePrice: 450,
    emoji: 'boost'
})

export const effectBookItem = new Item({
    id: 4,
    key: 'other/effect-book',
    isConsumable: false,
    basePrice: 1000,
    emoji: 'book'
})

export const freeBuyItem = new Item({
    id: 5,
    key: 'other/free-buy',
    isConsumable: true,
    rarity: 10,
    basePrice: 50_000,
    emoji: 'free'
})

export const fuelOreItem = new Item({
    id: 6,
    key: 'fuel/ore',
    isConsumable: true,
    rarity: 5,
    basePrice: 100,
    emoji: 'fuel'
})

export const fuelGunItem = new Item({
    id: 7,
    key: 'fuel/gun',
    isConsumable: false,
    rarity: 8,
    gun: {
        damage: [50, 100],
        ammo: fuelOreItem
    },
    basePrice: 8000,
    emoji: 'fuel'
})

export const glassItem = new Item({
    id: 8,
    key: 'raw/glass',
    isConsumable: true,
    rarity: 4,
    basePrice: 40,
    emoji: 'glass'
})

export const greedBoxItem = new Item({
    id: 9,
    key: 'other/greed-box',
    isConsumable: false,
    rarity: 15,
    maxCount: {
        chat: 1
    },
    basePrice: 2_000_000,
    emoji: 'moneyfarm',
    callbacks: {
        use: async ({
            ctx,
            chatId,
            id,
            item
        }) => {
            const box = await GreedBoxService.use(
                chatId,
                id
            )

            const user = await ctx.vars.user.get()
            const used = box.used
            const chance = GREED_BOX_LEAVE_CHANCE * used
            const money = Math.min(GREED_BOX_PRIZE ** used, MAX_GREED_BOX_PRIZE)

            if (RandomUtils.chance(chance)) {
                const leaveVars = await Promise.all([
                    GreedBoxService.zero(chatId, id),
                    InventoryItemService.remove({
                        chatId,
                        id,
                        item
                    }),
                    MessageUtils.reply(
                        ctx,
                        'greed-box/leave',
                        {
                            vars: {
                                user
                            }
                        }
                    ),
                ])

                Logger.debug('greedBoxItem.use', leaveVars)
                return
            }

            await Promise.all([
                BalanceService.add({
                    chatId,
                    id,
                    money,
                }),
                MessageUtils.reply(
                    ctx,
                    'greed-box/use',
                    {
                        vars: {
                            user,
                            money
                        }
                    }
                )
            ])
        }
    }
})

export const infinityCasinoItem = new Item({
    id: 10,
    key: 'casino/infinity',
    isConsumable: false,
    basePrice: 50_000,
    emoji: 'casino'
})

export const levelBoostItem = new Item({
    id: 11,
    key: 'other/level-boost',
    isConsumable: false,
    basePrice: 1000,
    emoji: 'level'
})

export const casinoBoostItem = new Item({
    id: 12,
    key: 'casino/boost',
    isConsumable: false,
    basePrice: 5_000,
    emoji: 'casino'
})

export const metalItem = new Item({
    id: 13,
    key: 'raw/metal',
    isConsumable: true,
    rarity: 3,
    basePrice: 50,
    emoji: 'metal'
})

export const moneyGeneratorItem = new Item({
    id: 14,
    key: 'gen/device',
    isConsumable: true,
    basePrice: 2500,
    emoji: 'moneyfarm'
})

export const moneyGenLicenseItem = new Item({
    id: 15,
    key: 'gen/license',
    isConsumable: false,
    maxCount: {
        chat: 20
    },
    basePrice: 10_000,
    emoji: 'book'
})

export const newGameItem = new Item({
    id: 16,
    key: 'other/new-game',
    isConsumable: false,
    basePrice: greedBoxItem.basePrice,
    emoji: 'newgame'
})

export const oneTimeGunItem = new Item({
    id: 17,
    key: 'gun/one-time',
    isConsumable: true,
    rarity: 7,
    gun: {
        damage: [50, 200]
    },
    basePrice: 3200,
    emoji: 'gun',
})

export const pistolAmmoItem = new Item({
    id: 18,
    key: 'ammo/pistol',
    isConsumable: true,
    basePrice: 10,
    emoji: 'ammo',
})

export const defaultGunItem = new Item({
    id: 19,
    key: 'gun/default-pistol',
    isConsumable: false,
    gun: {
        damage: [
            5,
            7
        ],
        ammo: pistolAmmoItem
    },
    basePrice: 1000,
    emoji: 'gun',
})

export const rockVoidItem = new Item({
    id: 20,
    key: 'gun/rock-void',
    isConsumable: false,
    rarity: 15,
    gun: {
        damage: [1, 1]
    },
    basePrice: 1,
    emoji: 'rock',
    callbacks: {
        use: async ({
            ctx,
            chatId,
            id,
            item,
            count
        }) => {
            const damage = count
            await Promise.allSettled([
                MessageUtils.reply(
                    ctx,
                    'rock-void/use',
                    {
                        vars: {
                            user: await ctx.vars.user.get(),
                            item: item.getVars(ctx),
                            damage,
                            count
                        }
                    }
                ),
                DuelistService.add({
                    chatId,
                    id,
                    key: 'hp',
                    value: -count
                })
            ])
        }
    }
})

export const shopPercentItem = new Item({
    id: 21,
    key: 'shop/percent',
    isConsumable: true,
    maxCount: {
        chat: 100,
        user: 99
    },
    basePrice: 7_500,
    emoji: 'moneyfarm'
})

export const simpleShieldItem = new Item({
    id: 22,
    key: 'shield/simple',
    isConsumable: true,
    shield: {
        durability: 500
    },
    basePrice: 1000,
    emoji: 'shield',
    callbacks: {
        use: options => ShieldUtils.use(options)
    }
})

export const stickGunItem = new Item({
    id: 23,
    key: 'gun/stick',
    isConsumable: true,
    rarity: 9,
    gun: {
        damage: [
            1000,
            5000
        ]
    },
    basePrice: 25_000,
    emoji: 'wood'
})

export const stringsItem = new Item({
    id: 24,
    key: 'raw/strings',
    isConsumable: true,
    rarity: 2,
    basePrice: 35,
    emoji: 'string',
})

export const coolShieldItem = new Item({
    id: 25,
    key: 'shield/cool',
    isConsumable: true,
    shield: {
        durability: 2500
    },
    basePrice: 10_000,
    emoji: 'shield',
    callbacks: {
        use: options => ShieldUtils.use(options)
    }
})

export const valGiftItem = new Item({
    id: 26,
    key: 'other/val-gift',
    isConsumable: true,
    basePrice: 850,
    emoji: 'gift'
})

export const valLeafItem = new Item({
    id: 27,
    key: 'raw/leaf',
    isConsumable: true,
    rarity: 9,
    basePrice: 500,
    emoji: 'leaf'
})

export const woodItem = new Item({
    id: 28,
    key: 'raw/wood',
    isConsumable: true,
    rarity: 1,
    basePrice: 5,
    emoji: 'wood'
})

export const woodSwordItem = new Item({
    id: 29,
    key: 'gun/wood-sword',
    isConsumable: true,
    basePrice: 50,
    gun: {
        damage: [0, 0]
    },
    emoji: 'sword'
})

export const workCatalogItem = new Item({
    id: 30,
    key: 'work/catalog',
    isConsumable: false,
    basePrice: 800,
    emoji: 'book'
})

export const workBoostItem = new Item({
    id: 31,
    key: 'work/boost',
    isConsumable: false,
    basePrice: 400,
    emoji: 'boost'
})

export const cardBoxItem = new Item({
    id: 32,
    key: 'other/card-box',
    isConsumable: true,
    basePrice: 180,
    rarity: 2,
    emoji: 'card'
})

export const healGunItem = new Item({
    id: 33,
    key: 'gun/heal',
    isConsumable: true,
    basePrice: 20_000,
    emoji: 'heal',
    rarity: 8,
    gun: {
        damage: [-200, -10]
    }
})

export const unmuteItem = new Item({
    id: 34,
    key: 'activity/unmute',
    isConsumable: true,
    basePrice: 25_000,
    emoji: 'admin',
    callbacks: {
        use: async ({
            ctx,
            id,
            item,
            count
        }) => {
            const isUnmuted = await AdminUtils.unmute(ctx, id)

            await MessageUtils.reply(
                ctx,
                'admin/unmute/item',
                {
                    vars: {
                        title: item.getTitle(ctx),
                        user: await ctx.vars.user.get(),
                        count,
                        isUnmuted
                    }
                }
            )

            return isUnmuted
        }
    }
})

export const banItem = new Item({
    id: 35,
    key: 'activity/ban',
    isConsumable: true,
    basePrice: 1_000,
    emoji: 'admin',
    callbacks: {
        use: async ({
            ctx,
            id,
            item,
            count
        }) => {
            const isBanned = await AdminUtils.ban(ctx, id, 0)

            await MessageUtils.reply(
                ctx,
                'admin/ban/item',
                {
                    vars: {
                        title: item.getTitle(ctx),
                        user: await ctx.vars.user.get(),
                        count,
                        isBanned
                    }
                }
            )

            return isBanned
        }
    }
})

export const thanksItem = new Item({
    id: 36,
    key: 'activity/thanks',
    isConsumable: true,
    basePrice: 1,
    emoji: 'thanks',
    callbacks: {
        use: async ({
            ctx,
            count
        }) => {
            await MessageUtils.reply(
                ctx,
                'thanks/item',
                {
                    vars: {
                        user: await ctx.vars.user.get(),
                        count
                    }
                }
            )
        }
    }
})

export const resetClassItem = new Item({
    id: 37,
    key: 'activity/reset-class',
    isConsumable: true,
    basePrice: 12_500,
    emoji: 'class',
    callbacks: {
        use: async ({
            chatId,
            id,
            ctx
        }) => {
            await UserClassService.set(
                chatId,
                id,
                ClassUtils.defaultClassName
            )

            await MessageUtils.reply(
                ctx,
                'reset/class',
                {
                    vars: {
                        user: await ctx.vars.user.get()
                    }
                }
            )
        }
    }
})

export const resetSaveCooldownItem = new Item({
    id: 38,
    key: 'activity/reset-save',
    isConsumable: true,
    basePrice: 500,
    emoji: 'time',
    callbacks: {
        use: async ({
            chatId,
            id,
            ctx
        }) => {
            await DuelistService.resetSave(chatId, id)

            await MessageUtils.reply(
                ctx,
                'reset/save',
                {
                    vars: {
                        user: await ctx.vars.user.get()
                    }
                }
            )
        }
    }
})

export const orbitalGunItem = new Item({
    id: 39,
    key: 'gun/orbital',
    isConsumable: true,
    basePrice: 1_500_000,
    emoji: 'gun',
    gun: {
        damage: [1_000_000_000_000, 1_000_000_000_000]
    }
})

export const glockGunItem = new Item({
    id: 40,
    key: 'gun/glock',
    isConsumable: true,
    basePrice: 873,
    emoji: 'gun',
    gun: {
        damage: [-873, 873]
    },
    rarity: 13
})

export const soapGunItem = new Item({
    id: 41,
    key: 'gun/soap',
    isConsumable: false,
    basePrice: Infinity,
    emoji: 'soap',
    gun: {
        damage: [Infinity, Infinity]
    }
})

export const inventoryItems: Item<any>[] = [
    businessPaperItem,
    cookieItem,
    corporationItem,
    craftWorkUpItem,
    effectBookItem,
    freeBuyItem,
    fuelOreItem,
    fuelGunItem,
    glassItem,
    greedBoxItem,
    infinityCasinoItem,
    levelBoostItem,
    casinoBoostItem,
    metalItem,
    moneyGeneratorItem,
    moneyGenLicenseItem,
    newGameItem,
    oneTimeGunItem,
    pistolAmmoItem,
    defaultGunItem,
    rockVoidItem,
    shopPercentItem,
    simpleShieldItem,
    stickGunItem,
    stringsItem,
    coolShieldItem,
    valGiftItem,
    valLeafItem,
    woodItem,
    woodSwordItem,
    workCatalogItem,
    workBoostItem,
    cardBoxItem,
    healGunItem,
    unmuteItem,
    banItem,
    thanksItem,
    resetClassItem,
    resetSaveCooldownItem,
    orbitalGunItem,
    glockGunItem,
    soapGunItem,
]