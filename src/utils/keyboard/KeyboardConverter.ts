import { create, fromBinary, toBinary, type Message } from "@bufbuild/protobuf"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import Logger from "../logs/Logger"
import JsonUtils from "../string/JsonUtils"

type EncodeOptions<T extends Message> = {
    name: string
    schema: GenMessage<T & Message<any>>
    data: Omit<T, '$typeName'> & {
        $typeName?: string
    }
}

type DecodeOptions<T extends Message> = Pick<EncodeOptions<T>, 'schema'> & {
    data: string
}

export default class KeyboardConverter {
    private static readonly _separator = ':'

    private static _bytesToText(bytes: Uint8Array): string {
        return bytes.toBase64()
    }

    private static _textToBytes(data: string): Uint8Array {
        return Uint8Array.fromBase64(data)
    }

    static encode<T extends Message>({
        name,
        schema,
        data
    }: EncodeOptions<T>): string {
        const bytes = toBinary(
            schema,
            create(
                schema,
                data
            )
        )
        const text = this._bytesToText(bytes)
        const result = `${name}${this._separator}${text}`

        Logger.debug(
            'KeyboardConverter.encode',
            {
                data: {
                    text,
                    result,
                    bytes,
                    data
                },
                length: {
                    text: text.length,
                    result: result.length,
                    bytes: bytes.length,
                }
            }
        )

        return result
    }

    static splitEncoded(data: string): [string, string] | undefined {
        const result = data.split(this._separator) as [string, string]
        if (result.length < 2) return undefined

        return result
    }

    static decode<T extends Message>({
        schema,
        data
    }: DecodeOptions<T>): T | undefined {
        try {
            const bytes = this._textToBytes(data)
            const object = fromBinary(
                schema,
                bytes
            )

            Logger.debug(
                'KeyboardConverter.decode',
                {
                    data,
                    bytes,
                    json: JsonUtils.stringify(object)
                }
            )

            return object
        }
        catch (e) {
            Logger.error('KeyboardConverter.decode', e)
            return undefined
        }
    }
}

// scdel:s_}s*%eLxw2+Xv$Sb%ob^heMAJ<:N[*T6tB
// scdel:CJ7/gd0DEhQxMjM0NTY3ODkwMTIzNDU2Nzg5MA==