import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import InventoryItemsUtils from './InventoryItemsUtils'
import RandomUtils from './RandomUtils'
import { Gun, GunWithId } from './values/types/items'
import { InventoryItemDescriptionWithId } from './values/types/items'

type Id = GunWithId['id']

export default class {
    private static _gunsRecord: Record<Id, GunWithId> = {}

    static setup(
        items: InventoryItemDescriptionWithId[]
    ) {
        for (const item of items) {
            if(item.gun) {
                const {
                    id,
                    gun
                } = item

                this._gunsRecord[id] = {
                    ...gun,
                    id
                }
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
        } as GunWithId
    }

    static getDamage(id: Id) {
        const damage = this._gunsRecord[id]?.damage
        if (!damage) return this.getDummyDamage()

        const [min, max] = damage
        return RandomUtils.range(min, max)
    }

    static getAmmoItemId(gunId: Id) {
        const gun = this._gunsRecord[gunId] ?? this.getDummyGun()
        return gun.ammo ?? gun.id
    }

    static getAmmoDescription(gunId: Id) {
        const ammoId = this.getAmmoItemId(gunId)
        return InventoryItemsUtils.getItemDescription(ammoId)
    }

    static getGun(id: Id) {
        return this._gunsRecord[id] ?? this.getDummyGun()
    }

    static getFirstGunFromInventory(items: InventoryItem[]) {
        for (const { itemId } of items) {
            const gun = this._gunsRecord[itemId]
            if(!gun) continue
            
            const ammoId = gun.ammo
            
            if(gun) {
                if(!ammoId) {
                    return gun
                }

                const ammo = items.find(item => item.itemId == ammoId)
                if(!(ammo && (ammo.count ?? 0) > 0)) continue

                return gun
            }
        }

        return this.getDummyGun()
    }
}