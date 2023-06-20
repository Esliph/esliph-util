
const PATTERNS_CODE = {
    grey: '30',
    red: '31',
    green: '32',
    yellow: '33',
    blue: '34',
    purple: '35',
    white: '37',
    opaque: '2'
}

const EnumColorsText = {
    default: '39',
    black: '30',
    red: '31',
    redLight: '91',
    green: '32',
    greenLight: '92',
    yellow: '33',
    yellowLight: '93',
    blue: '34',
    blueLight: '94',
    magenta: '35',
    magentaLight: '95',
    cyan: '36',
    cyanLight: '96',
    white: '37',
    grey: '1',
    greyLight: '1',
    purple: '35',
    purpleLight: '95',
} as const

const EnumColorsBackground = {
    default: '49',
    black: '40',
    blackLight: '40',
    red: '41',
    redLight: '101',
    green: '42',
    greenLight: '102',
    yellow: '43',
    yellowLight: '103',
    blue: '44',
    blueLight: '104',
    magenta: '45',
    magentaLight: '105',
    cyan: '46',
    cyanLight: '106',
    white: '47',
    whiteLight: '107',
    grey: '47',
    greyLight: '47',
    purple: '45',
    purpleLight: '105',
} as const

const EnumColorsStyles = {
    default: '39',
    bold: '1',
    italic: '3',
    underline: '4',
    strikethrough: '9',
} as const

const SCAPE_SEQUENCE = '\x1b'
const SUFFIX_CODE = 'm'
const PREFIX_CODE = `${SCAPE_SEQUENCE}[`
const RESET_TEXT_STYLE = '0'

export type ColorsTextEnable = keyof typeof EnumColorsText;
export type ColorsBackgroundEnable = keyof typeof EnumColorsBackground;
export type ColorsTextStyles = keyof typeof EnumColorsStyles;
export type ColorsConsoleType = number | string | boolean | object | any[] | Function | bigint | null | undefined
type CodeType = string | number

function isColorAllowed() { return !process.env.NO_COLOR }

function orderCodes({ color, background, styles }: { color: CodeType, background?: CodeType, styles?: CodeType[] }) {
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

}

export function colorizeText(text: ColorsConsoleType, { color, background, styles }: { color: ColorsTextEnable, background?: ColorsBackgroundEnable, styles?: ColorsTextStyles | ColorsTextStyles[] }) {
    let textColored = text
    if (!isColorAllowed()) { return `${textColored}` }

    if (!EnumColorsText[color]) { return `${textColored}` }

    const codeColor = EnumColorsText[color]
    const codeBackground = background ? EnumColorsBackground[background] : ''
    const codesStyles = styles ? typeof styles == 'string' ? [EnumColorsStyles[styles]] : styles.map(style => EnumColorsStyles[style]) : []

    const codes = orderCodes({ color: codeColor, background: codeBackground, styles: codesStyles })

    const fullCode = getFullCodes(...codes)

    return `${fullCode}${textColored}${getFullCodes(RESET_TEXT_STYLE)}`
}

console.log(colorizeText('Hello World', { color: 'red' }))
console.log(colorizeText('Hello World', { color: 'red', background: 'redLight' }))
console.log(colorizeText('Hello World', { color: 'red', styles: ['underline'] }))
console.log(colorizeText('Hello World', { color: 'red', styles: ['italic'] }))
console.log(colorizeText('Hello World', { color: 'red', styles: 'bold' }))
console.log(colorizeText('Hello World', { color: 'red', styles: ['italic', 'strikethrough', 'underline'] }))