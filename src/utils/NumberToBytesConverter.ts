export default class {
    private static readonly _isLittleEndian = false
    private static readonly _bufferSize = 8
    private static readonly _startOffset = 0
    private static readonly _skipNumber = 0
    private static readonly _startSymbol = '~'

    static toBytes(num: number): string {
        const stringNumber = `${num}`
        if(stringNumber.length <= 3) {
            return stringNumber
        }

        const buffer = new ArrayBuffer(this._bufferSize)
        const dataView = new DataView(buffer)

        dataView.setFloat64(
            this._startOffset, 
            num, 
            this._isLittleEndian
        )

        let bytes = ''
        for (let i = this._startOffset; i < this._bufferSize; i++) {
            const byte = dataView.getUint8(i)
            if(byte == this._skipNumber) continue

            const symb = String.fromCodePoint(byte)
            bytes += symb
        }

        return `${this._startSymbol}${bytes}`
    }

    static toNumber(bytesString: string): number {
        if (!bytesString.startsWith(this._startSymbol)) {
            return +bytesString
        }
        
        const bytesPart = bytesString.substring(1)
        const bytesArray = new Uint8Array(this._bufferSize)
        let bytesIndex = 0
        
        for (let i = 0; i < bytesPart.length; i++) {
            const byte = bytesPart.codePointAt(i) ?? 0
            bytesArray[bytesIndex++] = byte
        }
        
        while (bytesIndex < this._bufferSize) {
            bytesArray[bytesIndex++] = 0
        }
        
        const buffer = new ArrayBuffer(this._bufferSize)
        const dataView = new DataView(buffer)
        
        for (let i = this._startOffset; i < this._bufferSize; i++) {
            dataView.setUint8(i, bytesArray[i])
        }
        
        return dataView.getFloat64(
            this._startOffset, 
            this._isLittleEndian
        )
    }

    static replaceNumberToBytes(input: string): string {
        const numberRegex = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g
        
        return input.replace(numberRegex, (match) => {
            const num = parseFloat(match)
            return this.toBytes(num)
        })
    }

    static replaceBytesToNumber(input: string): string {
        const bytesRegex = new RegExp(`${this._startSymbol}\\S*?(?=,|}|"|$)`, 'g')
        
        return input.replace(bytesRegex, (match) => {
            try {
                const num = this.toNumber(match)
                return num.toString()
            } catch (error) {
                return match
            }
        })
    }
}