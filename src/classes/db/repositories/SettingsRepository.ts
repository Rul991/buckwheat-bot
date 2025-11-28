import Settings from '../../../interfaces/schemas/settings/Settings'
import SettingsModel from '../models/SettingsModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof SettingsModel, Settings>(SettingsModel)