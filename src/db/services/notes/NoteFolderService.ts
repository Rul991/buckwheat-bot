import NoteFolder from "../../entities/notes/NoteFolder"
import BaseService from "../base/BaseService"
import NoteService from "./NoteService"

class NoteFolderService extends BaseService<typeof NoteFolder> {
    constructor() {
        super(NoteFolder)
    }

    async get(folderId: number) {
        return await this._repo.findOne({
            id: folderId
        })
    }

    async getAllByOwner(owner: number, onlyPublic: boolean) {
        return await this._repo.find({
            owner,
            $or: onlyPublic ?
                [
                    { isPublic: true }
                ] :
                [
                    { isPublic: true },
                    { isPublic: false },
                ]
        })
    }

    async delete(folderId: number) {
        const result = await this._repo.deleteOne({
            id: folderId
        })
        const isDeleted = result.deletedCount > 0

        if (isDeleted) {
            await NoteService.deleteByFolder(folderId)
        }

        return isDeleted
    }

    async togglePublic(folderId: number) {
        return await this._repo.updateOne(
            {
                id: folderId
            },
            [
                {
                    $set: {
                        isPublic: {
                            $not: '$isPublic'
                        }
                    }
                }
            ]
        )
    }
}

export default new NoteFolderService()