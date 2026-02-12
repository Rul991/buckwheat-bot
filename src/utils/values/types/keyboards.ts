export type StringOrStringArray = string | string[]
export type JsonButtonData = Record<string, any>

export type Globals = JsonButtonData
export type Value = {
    text: string
    data: JsonButtonData
}
export type Values = Record<string, Value[]>
export type Variables = Record<string, JsonButtonData>
export type ReplaceKeyboardData = {
    globals?: Globals
    values?: Values
    maxWidth?: number
}

export type Button = {
    text: string
    callback_data: string
}
export type Keyboard = Button[][]

export type JsonButton = {
    text: StringOrStringArray
    name: string
    data: {
        $additional?: JsonButtonData
        $vars?: string[]
        $each?: string
        $if?: string | boolean
    }
}

export type JsonKeyboard = {
    markup: StringOrStringArray[]
    definition: Record<string, JsonButton>
    variables?: Record<string, Record<string, string>>
}