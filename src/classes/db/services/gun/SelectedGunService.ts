import GunsUtils from '../../../../utils/GunsUtils'
import SelectedGunRepository from '../../repositories/SelectedGunRepository'
import InventoryItemService from '../items/InventoryItemService'

export default class {
    static async get(chatId: number, id: number) {
        return await SelectedGunRepository.getOrCreate(
            chatId,
            id,
            {
                chatId,
                id
            }
        )
    }

    static async set(chatId: number, id: number, gunId?: string) {
        return await SelectedGunRepository.updateOne(
            chatId,
            id,
            {
                $set: {
                    gunId: gunId || ''
                }
            }
        )
    }

    static async getSelected(chatId: number, id: number) {
        const {
            gunId
        } = await this.get(chatId, id)

        const items = await InventoryItemService.getAll(chatId, id)

        if(!gunId) {
            return GunsUtils.getFirstGunFromInventory(items)
        }
        
        const ammoId = GunsUtils.getAmmoItemId(gunId)
        const hasAmmo = ammoId.length && items.some(item => item.itemId == ammoId && (item.count ?? 0) > 0)

        if(hasAmmo) {
            return GunsUtils.getGun(gunId)
        }
        else {
            return GunsUtils.getFirstGunFromInventory(items)
        }
    }
}