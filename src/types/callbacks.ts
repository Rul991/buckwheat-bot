import type { ItemCallbackOptions } from "./items"

export type ObjOrCallback<T> = T | (() => T | Promise<T>)
export type ItemCallback<T> = (options: ItemCallbackOptions) => Promise<T> | T