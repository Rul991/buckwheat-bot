import SelectedGun from '../../../interfaces/schemas/gun/SelectedGun'
import SelectedGunModel from '../models/SelectedGunModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof SelectedGunModel, SelectedGun>(SelectedGunModel)