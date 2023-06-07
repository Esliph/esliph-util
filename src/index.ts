import { ErrorGeneral } from '@lib/error'
import { randomId } from '@lib/generate-id'
import { hash } from '@lib/hash'
import { ObserverEvent } from '@lib/observer'
import { Result } from '@lib/result'
import { getEnv } from '@lib/var-env'
import { getAllFlags, getFlag } from '@lib/flag-node'

export { ErrorGeneral, randomId, hash, ObserverEvent, Result, getEnv, getAllFlags, getFlag }

type Events = 'teste1' | 'teste2' | 'teste3' | 'teste4'

const obs = ObserverEvent<Events>()

obs.on('teste1', () => {})
