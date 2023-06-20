import { ColorsBackgroundEnable, ColorsTextEnable, colorizeText } from '@util/color'

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
    method: {
        log: {
            color: ColorsTextEnable;
            background?: ColorsBackgroundEnable;
        };
        warn: {
            color: ColorsTextEnable;
            background?: ColorsBackgroundEnable;
        };
        error: {
            color: ColorsTextEnable;
            background?: ColorsBackgroundEnable;
        };
    };
} = {
    method: {
        log: { color: 'blue' },
        warn: { color: 'grey' },
        error: { color: 'grey' },
    },
}

const MethodColors: {
    [x in keyof typeof EnumConsoleMethod]: ColorsTextEnable;
} = {
    log: 'blue',
    warn: 'yellow',
    error: 'red',
} as const

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
};

const DEFAULT_CONFIG: ConsoleConfig = {
    showDataTime: true,
    pidName: 'string',
    showPid: true,
    showPidCode: true,
}

const DEFAULT_CONFIG_CLEAR: ConsoleConfig = {
    showDataTime: false,
    showPid: false,
}

export class Console {
    private context?: string
    private config: ConsoleConfig
    private messageClear?: boolean

    constructor(args?: {
        context?: string;
        config?: ConsoleConfig;
        clearMessage?: boolean;
    }) {
        this.config = { ...DEFAULT_CONFIG }

        if (args) {
            this.context = args.context
            this.messageClear = args.clearMessage

            if (args.config) {
                this.config = { ...this.config, ...args.config }
            }

            if (args.clearMessage) {
                this.config = { ...this.config, ...DEFAULT_CONFIG_CLEAR }
            }
        }
    }

    // Util
    getContext() {
        return this.context
    }

    private getTimestamp(dateTime = new Date(Date.now())): string {
        return dateTimeFormatter.format(dateTime).replace(', ', ' - ')
    }

    private getColorMessageFormate({
        dateTime,
        message,
        method,
        context,
        pidName,
        pidCode,
    }: {
        pidName?: string;
        pidCode?: number;
        message: ConsoleArgument;
        context?: string;
        method: ConsoleMethod;
        dateTime: Date;
    }) {
        return {
            dateTime,
            message: colorizeText(message, MethodColors[`${method}`]),
            method: colorizeText(
                method,
                MessageColors['method'][method].color,
                MessageColors['method'][method].background
            ),
            context,
            pidName,
            pidCode,
        }
    }

    private getFormateMessage({
        message,
        context,
        method,
        dateTime,
        pidName,
        pidCode,
    }: {
        message: ConsoleArgument;
        context?: string;
        method: ConsoleMethod;
        dateTime: Date;
        pidName?: string;
        pidCode?: number;
    }) {
        let mess = message
        if (typeof mess != 'string') {
            mess = JSON.stringify(message)
        }

        const mc = this.getColorMessageFormate({
            message,
            context,
            method,
            dateTime,
            pidName,
            pidCode,
        })

        let messageFormatted = ''

        if (mc.pidName && this.config.showPid) {
            messageFormatted = `${mc.pidName ? `${`[${mc.pidName}]`} ` : ''}`

            if (this.config.showPidCode) {
                messageFormatted += `${mc.pidCode}  `
            }
        }

        if (this.config.showDataTime) {
            messageFormatted += `${this.config.showDataTime && `${this.getTimestamp(mc.dateTime)}  `
                }`
        }

        messageFormatted += `${mc.method}${mc.context ? `\t[${mc.context}]\t` : ''}${mc.message
            }\n`

        return messageFormatted
    }

    // UC
    log(message: ConsoleArgument, context?: string) {
        this.print({ message, writeStreamType: 'log', context, method: 'log' })
    }

    error(message: ConsoleArgument, context?: string) {
        this.print({ message, writeStreamType: 'error', context, method: 'error' })
    }

    warn(message: ConsoleArgument, context?: string) {
        this.print({ message, writeStreamType: 'log', context, method: 'warn' })
    }

    private print({
        message: mes,
        writeStreamType = 'log',
        context: c = this.context,
        method: met,
    }: {
        message: ConsoleArgument;
        context?: string;
        method: ConsoleMethod;
        writeStreamType?: keyof typeof EnumWriteStream;
    }) {
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

    static clear() {
        process['stdout'].write('\x1B[2J\x1B[0f')
    }
}
