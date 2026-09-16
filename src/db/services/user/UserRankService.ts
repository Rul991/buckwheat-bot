import BaseUserService from "./BaseUserService"

class UserRankService extends BaseUserService<'rank'> {
    constructor() {
        super('rank')
    }
}

export default new UserRankService()