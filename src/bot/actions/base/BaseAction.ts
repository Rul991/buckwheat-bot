export default abstract class BaseAction {
    abstract name: string
    abstract execute(options: Record<string, any>): Promise<any>
}