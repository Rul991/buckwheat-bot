import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import FileUtils from './FileUtils'
import ObjectValidator from './ObjectValidator'
import RandomUtils from './RandomUtils'
import { gunsSchema } from './values/schemas'
import { Gun } from './values/types/guns'

export default class {
    private static _gunsRecord: Record<Gun['id'], Gun['damage']> = {}

    static async setup() {
        const guns = await FileUtils.readJsonFromResource<Gun[]>(
            'json/other/guns.json'
        )
        if (!guns) return false
        if(!ObjectValidator.isValidatedObject(guns, gunsSchema)) return false

        for (const gun of guns) {
            const {
                id,
                damage
            } = gun

            this._gunsRecord[id] = damage
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

    static getDamage(id: Gun['id']) {
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