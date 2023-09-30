import { EnumColorsBackground, EnumColorsStyles, EnumColorsText, PREFIX_CODE, RESET_TEXT_STYLE, SCAPE_SEQUENCE, SUFFIX_CODE } from './constants'

export { EnumColorsBackground, EnumColorsStyles, EnumColorsText }

export type ColorizeArgs = { color?: ColorsTextEnable; background?: ColorsBackgroundEnable; styles?: ColorsTextStylesEnable | ColorsTextStylesEnable[] }
export type ColorsTextEnable = keyof typeof EnumColorsText
export type ColorsBackgroundEnable = keyof typeof EnumColorsBackground
export type ColorsTextStylesEnable = keyof typeof EnumColorsStyles
export type ColorsConsoleType = number | string | boolean | object | any[] | Function | bigint | null | undefined
type CodeType = string | number

function isColorAllowed() {
    return !process.env.NO_COLOR
}

function orderCodes({ color, background, styles }: { color: CodeType; background?: CodeType; styles?: CodeType[] }) {
    const codes: CodeType[] = []

    /* eslint no-unused-expressions: ["off"] */
    color && codes.push(color)
    background && codes.push(background)
    styles && codes.push(...styles)

    return codes
}

function getFullCodes(...codes: CodeType[]) {
    return `${PREFIX_CODE}${codes.join(';')}${SUFFIX_CODE}`
}

function colorize(text: ColorsConsoleType, ...codes: CodeType[]) {
    return `${getFullCodes(...codes)}${text}${getFullCodes(RESET_TEXT_STYLE)}`
}

export function colorizeText(text: ColorsConsoleType, { color, background, styles }: ColorizeArgs) {
    if (!isColorAllowed()) {
        return `${text}`
    }

    const codeColor = color ? EnumColorsText[color] : ''
    const codeBackground = background ? EnumColorsBackground[background] : ''
    const codesStyles = styles ? (typeof styles == 'string' ? [EnumColorsStyles[styles]] : styles.map(style => EnumColorsStyles[style])) : []

    const codes = orderCodes({ color: codeColor, background: codeBackground, styles: codesStyles })

    return colorize(text, ...codes)
}
