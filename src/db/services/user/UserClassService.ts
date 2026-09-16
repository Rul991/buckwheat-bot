import BaseUserService from "./BaseUserService"

class UserClassService extends BaseUserService<'className'> {
    constructor() {
        super('className')
    }
}

export default new UserClassService()