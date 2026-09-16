export type PlayerTypes = 'knight' | 'thief' | 'sorcerer' | 'engineer' | 'bard'
export type ClassTypes = PlayerTypes | 'unknown' | 'boss' | 'bot'
export type ClassRecord<T = string> = Record<ClassTypes, T>
export type VisibleClassRecord<T = string> = Omit<ClassRecord<T>, 'bot' | 'boss' | 'unknown'>
export type ClassVars = {
    emoji: string
    name: string
}