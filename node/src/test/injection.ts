import { Metadata } from '../lib/metadata'
import { Injection } from './../lib/injection'

@Injection.Injectable('Service')
class Service {}

class Controller {
    constructor(@Injection.Inject('Service') private service: Service) {
        console.log(this.service)
    }
}

console.log(Metadata.Get.Parameter('param.inject.Service:0', Controller))

Injection.resolve(Controller)
