import BaseUserService from "./BaseUserService"

class UserDescriptionService extends BaseUserService<'description'> {
    constructor() {
        super('description')
    }
}

export default new UserDescriptionService()