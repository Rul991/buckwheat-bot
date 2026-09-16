import type Roleplay from "../../db/entities/rp/Roleplay"
import { GrammaticalCase } from "../../protos/rp_pb"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import RoleplayAddButton from "../actions/callback-query/rp/RoleplayAddButton"
import RoleplayChangeCaseButton from "../actions/callback-query/rp/RoleplayChangeCaseButton"
import RoleplayDeleteButton from "../actions/callback-query/rp/RoleplayDeleteButton"
import RoleplayEditTextButton from "../actions/callback-query/rp/RoleplayEditTextButton"
import RoleplayScrollerButton from "../actions/callback-query/rp/RoleplayScrollerButton"

export const startRoleplayKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data: {
            id
        },
        keyboard
    }) => {
        const bigId = BigInt(id)
        keyboard
            .add(
                RoleplayScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            $typeName: 'ScrollerData',
                            id: bigId,
                            data: {
                                case: 'update',
                                value: false
                            },
                        }
                    },
                    key: 'rp/button/start'
                })
            )
            .row()
            .add(
                RoleplayAddButton.button({
                    ctx,
                    data: {
                        id: bigId
                    }
                })
            )
            .row()
    }
)

export const showRoleplayKeyboard = KeyboardCreator.create<{
    id: number,
    page: number
    roleplay: Roleplay
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const {
            id: rawId,
            page,
            roleplay
        } = data

        const objectId = roleplay._id!.id
        const caseValue = roleplay.case

        const id = BigInt(rawId)
        const changeCaseButtonPartialData = {
            id,
            objectId,
            page
        }

        const cases = [
            GrammaticalCase.Genitive,
            GrammaticalCase.Dative,
            GrammaticalCase.Creative
        ]

        const caseButtons = cases
            .filter(v => v != caseValue)
            .map(v => {
                return RoleplayChangeCaseButton.button({
                    ctx,
                    data: {
                        ...changeCaseButtonPartialData,
                        caseValue: v,
                    }
                })
            })

        keyboard
            .add(
                RoleplayDeleteButton.button({
                    ctx,
                    data: {
                        id,
                        objectId,
                        page
                    },
                    style: 'danger'
                })
            )
            .row()

        keyboard.add(
            RoleplayEditTextButton.button({
                ctx,
                data: {
                    id,
                    objectId
                }
            })
        )
        keyboard.row()

        keyboard.add(...caseButtons)
        keyboard.row()

        keyboard.add(RoleplayScrollerButton.button({
            ctx,
            key: 'button/back',
            data: {
                data: {
                    $typeName: 'ScrollerData',
                    id,
                    data: {
                        case: 'page',
                        value: page
                    }
                }
            }
        }))
    }
)

export const backRoleplayKeyboard = KeyboardCreator.create<{
    id: number,
    page?: number
}>(
    async ({
        ctx,
        data: {
            id,
            page
        },
        keyboard
    }) => {
        const bigId = BigInt(id)
        keyboard
            .add(
                RoleplayScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            $typeName: 'ScrollerData',
                            id: bigId,
                            data: page === undefined ?
                                {
                                    case: 'update',
                                    value: false
                                } :
                                {
                                    case: 'page',
                                    value: page
                                },
                        }
                    },
                    key: 'rp/button/start'
                })
            )
    }
)