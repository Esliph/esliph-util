export const EnumColorsText = {
    default: '39',
    blackDark: '30;2',
    black: '30',
    blackLight: '90',
    redDark: '31;2',
    red: '31',
    redLight: '91',
    greenDark: '32;2',
    green: '32',
    greenLight: '92',
    yellowDark: '33;2',
    yellow: '33',
    yellowLight: '93;1',
    blueDark: '34;2',
    blue: '34',
    blueLight: '94',
    magentaDark: '35;2',
    magenta: '35',
    magentaLight: '95',
    cyanDark: '36;2',
    cyan: '36',
    cyanLight: '96',
    white: '37',
    greyDark: '1;2',
    grey: '1',
    greyLight: '1',
} as const

export const EnumColorsBackground = {
    default: '49',
    blackDark: '40;2',
    black: '40',
    blackLight: '40',
    redDark: '41;2',
    red: '41',
    redLight: '101',
    greenDark: '42;2',
    green: '42',
    greenLight: '102',
    yellowDark: '43;2',
    yellow: '43',
    yellowLight: '103',
    blueDark: '44;2',
    blue: '44',
    blueLight: '104',
    magentaDark: '45;2',
    magenta: '45',
    magentaLight: '105',
    cyanDark: '46;2',
    cyan: '46',
    cyanLight: '106',
    whiteDark: '47;2',
    white: '47',
    whiteLight: '107',
    greyDark: '47;2',
    grey: '47',
    greyLight: '47',
} as const

export const EnumColorsStyles = {
    default: '39',
    bold: '1',
    italic: '3',
    underline: '4',
    doubleUnderline: '21',
    strikethrough: '9',
} as const

const SCAPE_SEQUENCE = '\x1b'
const SUFFIX_CODE = 'm'
const PREFIX_CODE = `${SCAPE_SEQUENCE}[`
const RESET_TEXT_STYLE = '0'

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
