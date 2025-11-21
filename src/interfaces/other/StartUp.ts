export default interface StartUp<T extends Record<string, any> = Record<string, any>> {
    start: T
    up: T
}