import Roleplays from '../../../interfaces/schemas/chat/Roleplays'
import RoleplaysModel from '../models/RoleplaysModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof RoleplaysModel, Roleplays>(RoleplaysModel)