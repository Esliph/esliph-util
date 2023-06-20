import { ColorsBackgroundEnable, ColorsTextEnable, colorizeText, ColorizeArgs } from '@util/color'

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

const EnumWriteStream = {
    log: 'stdout',
    error: 'stderr',
} as const

const EnumConsoleMethod = {
    log: 'log',
    error: 'error',
    warn: 'warn',
} as const

const MessageColors: {
    message: {
        log: ColorizeArgs;
        warn: ColorizeArgs;
        error: ColorizeArgs;
    };
    method: {
        log: ColorizeArgs;
        warn: ColorizeArgs;
        error: ColorizeArgs;
    };
    pid: ColorizeArgs
    context: ColorizeArgs
    dateTime: ColorizeArgs
} = {
    message: {
        log: { color: 'blue' },
        warn: { color: 'yellow' },
        error: { color: 'red' },
    },
    method: {
        log: { color: 'default', background: 'blue' },
        warn: { color: 'default', background: 'yellow' },
        error: { color: 'default', background: 'red' },
    },
    dateTime: { color: 'default' },
    context: { color: 'default' },
    pid: { color: 'blue' }
} as const

type MessageFormattedArgs = { text: any, colorize: ColorizeArgs }
export type ConsoleArgument =
    | number
    | string
    | boolean
    | object
    | any[]
    | Function
    | bigint
    | null
    | undefined;
export type ConsoleMethod = keyof typeof EnumConsoleMethod;
export type ConsoleConfig = {
    showDataTime?: boolean;
    pidName?: string;
    showPid?: boolean;
    showPidCode?: boolean;
    levels?: boolean | ConsoleMethod | ConsoleMethod[]
};

const DEFAULT_CONFIG: ConsoleConfig = {
    showDataTime: true,
    pidName: 'string',
    showPid: true,
    showPidCode: true,
    levels: ['error', 'log', 'warn']
}

const DEFAULT_CONFIG_CLEAR: ConsoleConfig = {
    showDataTime: false,
    showPid: false,
}

export class Console {
    private context?: string
    private config: ConsoleConfig & {
        levels?: ConsoleMethod[]
    }

    constructor(args?: { context?: string, config?: ConsoleConfig, clearMessage?: boolean }) {
        // @ts-expect-error
        this.config = { ...DEFAULT_CONFIG }

        if (args) {
            this.context = args.context

            if (args.config) {
                // @ts-expect-error
                this.config = { ...this.config, ...args.config }

                if (typeof args.config.levels != 'undefined') {
                    if (typeof args.config.levels == 'boolean') {
                        this.config.levels = args.config.levels ? [...DEFAULT_CONFIG.levels as ConsoleMethod[]] : []
                    }
                }
            }

            // @ts-expect-error
            if (args.clearMessage) { this.config = { ...this.config, ...DEFAULT_CONFIG_CLEAR } }
        }
    }

    // Util
    getContext() { return this.context }

    private getTimestamp(dateTime = new Date(Date.now())): string { return dateTimeFormatter.format(dateTime).replace(', ', ' - ') }

    private getColorMessageFormate({ dateTime, message, method, context, pid }: { pid?: MessageFormattedArgs; message: MessageFormattedArgs; context?: MessageFormattedArgs; method: MessageFormattedArgs; dateTime: MessageFormattedArgs }) {
        return {
            dateTime: colorizeText(dateTime.text, dateTime.colorize),
            message: colorizeText(message.text, message.colorize),
            method: colorizeText(method.text, method.colorize),
            context: context ? colorizeText(context.text, context.colorize) : '',
            pid: pid ? colorizeText(pid.text, pid.colorize) : '',
        }
    }

    isEnablePrint(method: ConsoleMethod) {
        return !!this.config.levels?.includes(method)
    }

    private getFormateMessage({ message, context, method, dateTime, pidName, pidCode, }: { message: ConsoleArgument; context?: string; method: ConsoleMethod; dateTime: Date; pidName?: string; pidCode?: number; }) {
        let mess = message
        if (typeof mess != 'string') { mess = JSON.stringify(message) }

        const dt = this.getTimestamp(dateTime)

        // # Pid
        let pidComponent = ''

        if (pidName && this.config.showPid) {
            pidComponent = `${pidName ? `${`[${pidName}]`} ` : ''}`

            if (this.config.showPidCode) { pidComponent += `${pidCode}  ` }
        }

        // # Date Time
        let dateTimeComponent = ''

        if (this.config.showDataTime) { dateTimeComponent = `${this.config.showDataTime && `${dt}  `}` }

        // # Method
        let methodComponent = ` ${method.toUpperCase()} `

        // # Context
        let contextComponent = `${context ? `\t[${context}]\t` : ''}`

        // # Message
        let messageComponent = `${message}`

        const mc = this.getColorMessageFormate({
            message: { text: messageComponent, colorize: MessageColors['message'][method] },
            context: { text: contextComponent, colorize: MessageColors['context'] },
            method: { text: methodComponent, colorize: MessageColors['method'][method] },
            dateTime: { text: dateTimeComponent, colorize: MessageColors['dateTime'] },
            pid: { text: pidComponent, colorize: MessageColors['pid'] },
        })

        return `${mc.pid}${mc.dateTime}${mc.method}${mc.context}${mc.message}\n`
    }

    // UC
    log(message: ConsoleArgument, context?: string) { this.print({ message, writeStreamType: 'log', context, method: 'log' }) }

    error(message: ConsoleArgument, context?: string) { this.print({ message, writeStreamType: 'error', context, method: 'error' }) }

    warn(message: ConsoleArgument, context?: string) { this.print({ message, writeStreamType: 'log', context, method: 'warn' }) }

    private print({ message: mes, writeStreamType = 'log', context: c = this.context, method: met, }: { message: ConsoleArgument; context?: string; method: ConsoleMethod; writeStreamType?: keyof typeof EnumWriteStream; }) {
        if (!this.isEnablePrint(met)) { return }

        const messageFormatted = this.getFormateMessage({
            message: mes,
            context: c,
            method: met,
            dateTime: new Date(Date.now()),
            pidName: this.config.pidName,
            pidCode: process.pid,
        })

        process[`${EnumWriteStream[writeStreamType]}`].write(messageFormatted)
    }

    static clear() { process['stdout'].write('\x1B[2J\x1B[0f') }
}
