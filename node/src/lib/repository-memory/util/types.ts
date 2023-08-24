export type PartialDeep<T> = { [x in keyof T]?: T[x] extends object ? PartialDeep<T[x]> : T[x] }
