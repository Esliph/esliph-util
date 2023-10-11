import { Injection } from './../lib/injection'

@Injection.Injectable()
class ServiceParent {
    log(str: string) {
        console.log(str)
    }
}

Injection.InjectableService('ServiceParent', ServiceParent)

@Injection.Injectable('Service')
class Service {
    constructor(@Injection.Inject('ServiceParent') private service1: ServiceParent) {}

    log(str: string) {
        this.service1.log(str)
    }
}

@Injection.Injectable()
class Controller {
    constructor(@Injection.Inject('Service') private service1: Service, @Injection.Inject('ServiceParent') private service2: ServiceParent) {}

    perform() {
        this.service1.log('Hello World')
        this.service2.log('Hello World')
    }
}

const instance = Injection.resolve(Controller)

instance.perform()

console.log(instance)
