const args = process.argv

const OPERATOR = ['=']

const FLAGS: { [x: string]: string } = {}

export function getFlag(flagName: string) {
    return FLAGS[flagName] || ''
}

export function getAllFlags() {
    return FLAGS
}

const initFlag = (flag: string) => {
    const op = OPERATOR.find(operator => flag.includes(operator))

    if (!op) {
        FLAGS[flag] = flag
        return
    }

    const [flagName, value] = flag.split(op)

    FLAGS[flagName] = value
}

const setup = () => {
    args.forEach((flag, i) => i > 1 && initFlag(flag))
}

setup()
