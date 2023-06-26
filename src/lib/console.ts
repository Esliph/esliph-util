import { colorizeText, ColorizeArgs, ColorsBackgroundEnable, ColorsConsoleType, ColorsTextEnable, ColorsTextStyles } from '@util/color'

const consoleNative = console

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour12: false,
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
    calendar: 'gregory',
})

const EnumConsoleMethod = {
    info: 'info',
    log: 'log',
    error: 'error',
    warn: 'warn',
} as const

type MessageColorsMethod = { [x in keyof typeof EnumConsoleMethod]: ColorizeArgs }
const MessageColors: {
    message: MessageColorsMethod
    method: MessageColorsMethod
    pid: MessageColorsMethod
    context: MessageColorsMethod
    dateTime: MessageColorsMethod
} = {
    message: {
        log: { color: 'default' },
        warn: { color: 'default' },
        error: { color: 'default' },
        info: { color: 'default' },
    },
    method: {
        log: { color: 'default', background: 'blue' },
        warn: { color: 'black', background: 'yellow' },
        error: { color: 'default', background: 'red' },
        info: { color: 'black', background: 'white' },
    },
    dateTime: {
        log: { color: 'default' },
        warn: { color: 'default' },
        error: { color: 'default' },
        info: { color: 'default' },
    },
    context: {
        log: { color: 'green' },
        warn: { color: 'green' },
        error: { color: 'green' },
        info: { color: 'green' },
    },
    pid: {
        log: { color: 'green' },
        warn: { color: 'green' },
        error: { color: 'green' },
        info: { color: 'green' },
    },
} as const

type MessageFormattedArgs = { text: any; colorize: ColorizeArgs }
type ConsoleArgument = number | string | boolean | object | any[] | Function | bigint | null | undefined
type ConsoleMethod = keyof typeof EnumConsoleMethod
type ConsoleConfig = {
    levels?: boolean | ConsoleMethod | ConsoleMethod[]
    normal?: boolean
    showDataTime?: boolean
    pidName?: string
    showPid?: boolean
    showPidCode?: boolean
    showPidName?: boolean
    context?: string
    clearMessage?: boolean
    messageSameLine?: boolean
    noColor?: boolean
}

const DEFAULT_CONFIG: ConsoleConfig = {
    showDataTime: true,
    pidName: '',
    showPid: true,
    showPidName: true,
    showPidCode: true,
    clearMessage: false,
    context: '',
    messageSameLine: true,
    noColor: false,
    normal: false,
    levels: ['error', 'log', 'warn', 'info'],
}

const DEFAULT_CONFIG_CLEAR: ConsoleConfig = {
    showDataTime: false,
    showPid: false,
}

export class Console {
    private config: ConsoleConfig & {
        levels?: ConsoleMethod[]
    }

    constructor(args?: ConsoleConfig) {
        // @ts-expect-error
        this.config = { ...DEFAULT_CONFIG }

        if (args) {
            this.updateConfig(args)
        }
    }

    // Util
    getContext() {
        return this.config.context
    }

    private getConfig(options?: Omit<ConsoleConfig, 'levels'>) {
        const configs = [this.config, options]

        /* eslint no-unused-expressions: ["off"] */
        options && options.clearMessage && configs.push(DEFAULT_CONFIG_CLEAR)

        const config = Object.assign({}, ...configs)

        return config
    }

    private getTimestamp(dateTime = new Date(Date.now())): string {
        return dateTimeFormatter.format(dateTime).replace(', ', ' ')
    }

    private getColorMessageFormate(
        {
            dateTime,
            message,
            method,
            context,
            pid,
        }: {
            pid?: MessageFormattedArgs
            message: MessageFormattedArgs
            context?: MessageFormattedArgs
            method: MessageFormattedArgs
            dateTime: MessageFormattedArgs
        },
        noColor = false
    ) {
        if (noColor) {
            return {
                dateTime: dateTime.text,
                message: message.text,
                method: method.text,
                context: context?.text || '',
                pid: pid?.text || '',
            }
        }
        return {
            dateTime: this.colorizeText(dateTime.text, dateTime.colorize),
            message: this.colorizeText(message.text, message.colorize),
            method: this.colorizeText(method.text, method.colorize),
            context: context ? this.colorizeText(context.text, context.colorize) : '',
            pid: pid ? this.colorizeText(pid.text, pid.colorize) : '',
        }
    }

    isEnablePrint(method: ConsoleMethod) {
        return !!this.config.levels?.includes(method)
    }

    private getFormateMessage(
        {
            message,
            context,
            method,
            dateTime,
            pidName,
            pidCode,
        }: {
            message: ConsoleArgument
            context?: string
            method: ConsoleMethod
            dateTime: Date
            pidName?: string
            pidCode?: number
        },
        config?: { messageSameLine?: boolean; noColor?: boolean }
    ) {
        let mess = message || ''

        if (typeof mess == 'object' || Array.isArray(mess)) {
            mess = JSON.stringify(mess, null, 2)
        }

        const dt = this.getTimestamp(dateTime)

        // # Pid
        let pidComponent = ''

        if (this.config.showPid) {
            if (pidName && this.config.showPidName) {
                pidComponent = `[${pidName}] `
            }
            if (this.config.showPidCode) {
                pidComponent += `${pidCode}`
            }
        }

        // # Date Time
        let dateTimeComponent = ''

        if (this.config.showDataTime) {
            dateTimeComponent = `${this.config.showDataTime && `${dt}`}`
        }

        // # Method
        let methodComponent = ` ${method.toUpperCase()} `

        // # Context
        let contextComponent = `${context ? ` [${context}] ` : ''}`

        // # Message
        let messageComponent = `${!config || !config.messageSameLine || typeof message == 'object' || Array.isArray(message) ? '\n' : ''}${mess}`

        const mc = this.getColorMessageFormate(
            {
                message: { text: messageComponent, colorize: MessageColors['message'][method] },
                context: { text: contextComponent, colorize: MessageColors['context'][method] },
                method: { text: methodComponent, colorize: MessageColors['method'][method] },
                dateTime: { text: dateTimeComponent, colorize: MessageColors['dateTime'][method] },
                pid: { text: pidComponent, colorize: MessageColors['pid'][method] },
            },
            config?.noColor
        )

        return `${mc.pid && `${mc.pid}  `}${mc.dateTime && `${mc.dateTime}  `}${mc.method && `${mc.method} `}${mc.context}${mc.message}`
    }

    // UC
    updateConfig(options: Partial<ConsoleConfig>) {
        // @ts-expect-error
        this.config = { ...this.config, ...options }

        if (typeof options.levels != 'undefined') {
            if (typeof options.levels == 'boolean') {
                this.config.levels = options.levels ? [...(DEFAULT_CONFIG.levels as ConsoleMethod[])] : []
            }
        }
    }

    log(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        const { clearMessage, context, messageSameLine, normal, pidName, showDataTime, showPid, showPidCode, showPidName } = this.getConfig(options)

        this.print({
            clearMessage,
            context,
            messageSameLine,
            normal,
            pidName: pidName || '',
            showDataTime,
            showPid,
            showPidCode,
            showPidName,
            message,
            dateTime: new Date(Date.now()),
            pidCode: process.pid,
            method: 'log',
        })
    }

    error(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        const { clearMessage, context, messageSameLine, normal, pidName, showDataTime, showPid, showPidCode, showPidName } = this.getConfig(options)

        this.print({
            clearMessage,
            context,
            messageSameLine,
            normal,
            pidName: pidName || '',
            showDataTime,
            showPid,
            showPidCode,
            showPidName,
            message,
            dateTime: new Date(Date.now()),
            pidCode: process.pid,
            method: 'error',
        })
    }

    warn(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        const { clearMessage, context, messageSameLine, normal, pidName, showDataTime, showPid, showPidCode, showPidName } = this.getConfig(options)

        this.print({
            clearMessage,
            context,
            messageSameLine,
            normal,
            pidName: pidName || '',
            showDataTime,
            showPid,
            showPidCode,
            showPidName,
            message,
            dateTime: new Date(Date.now()),
            pidCode: process.pid,
            method: 'warn',
        })
    }

    info(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        const { clearMessage, context, messageSameLine, normal, pidName, showDataTime, showPid, showPidCode, showPidName } = this.getConfig(options)

        this.print({
            clearMessage,
            context,
            messageSameLine,
            normal,
            pidName: pidName || '',
            showDataTime,
            showPid,
            showPidCode,
            showPidName,
            message,
            dateTime: new Date(Date.now()),
            pidCode: process.pid,
            method: 'info',
        })
    }

    colorizeText(text: ColorsConsoleType, args: ColorizeArgs) {
        return colorizeText(text, args)
    }

    private print(
        args: {
            message: ConsoleArgument
            method: ConsoleMethod
            pidName: string
            pidCode: number
            dateTime: Date
        } & Omit<ConsoleConfig, 'levels'>
    ) {
        if (!this.isEnablePrint(args.method)) {
            return
        }

        if (args.normal) {
            return console.log(args.message || '')
        }

        const messageFormatted = this.getFormateMessage(args, args)

        console.log('#', messageFormatted)
    }

    clear() {
        process['stdout'].write('\x1B[2J\x1B[0f')
    }

    static clear() {
        new Console().clear()
    }

    static log(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        new Console().log(message, options)
    }
    static error(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        new Console().error(message, options)
    }
    static warn(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        new Console().warn(message, options)
    }
    static info(message?: ConsoleArgument, options?: Omit<ConsoleConfig, 'levels'>) {
        new Console().info(message, options)
    }
}
