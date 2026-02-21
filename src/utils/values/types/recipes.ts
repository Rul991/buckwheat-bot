export type Recipe = {
    materials: Record<string, number>
    result: {
        name: string
        count?: number
    }
    level: number
    experience: number
}