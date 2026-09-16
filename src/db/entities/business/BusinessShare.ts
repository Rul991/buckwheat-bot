import IdEntity from "../base/IdEntity"

export default class BusinessShare extends IdEntity {
    constructor({
        id
    }: Omit<BusinessShare, '_id'>) {
        super(id)
    }
}