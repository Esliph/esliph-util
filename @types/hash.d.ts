export const hash = {
    generate: (text: string) => Promise<string>,
    compare: (hash: string, ref: string) => Promise<boolean>,
}