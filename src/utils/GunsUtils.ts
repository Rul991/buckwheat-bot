import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import RandomUtils from './RandomUtils'
import { Gun } from './values/types/guns'
import { InventoryItemDescriptionWithId } from './values/types/types'

type Id = InventoryItemDescriptionWithId['id']

export default class {
    private static _gunsRecord: Record<Id, Gun['damage']> = {}

    static setup(
        items: InventoryItemDescriptionWithId[]
    ) {
        for (const item of items) {
            if(item.gun) {
                const {
                    id,
                    gun: {
                        damage
                    }
                } = item

                this._gunsRecord[id] = damage
            }
        }
        return true
    }

    static getDummyDamage() {
        return -1
    }

    static getDummyGun() {
        const damage = this.getDummyDamage()

        return {
            id: '',
            damage: [damage, damage]
        } as Gun
    }

    static getDamage(id: Id) {
        const damage = this._gunsRecord[id]
        if (!damage) return this.getDummyDamage()

        const [min, max] = damage
        return RandomUtils.range(min, max)
    }

    static getGun(items: InventoryItem[]) {
        for (const { itemId, count = 0 } of items) {
            const gunDamage = this._gunsRecord[itemId]
            if(gunDamage && count > 0) {
                return {
                    damage: gunDamage,
                    id: itemId
                }
            }
        }

        return this.getDummyGun()
    }
}