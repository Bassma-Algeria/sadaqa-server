import { WilayasRepository } from './core/domain/services/WilayasRepository';
import { GetAllWilayasUseCase } from './core/usecases/GetAllWilayasUseCase/GetAllWilayasUseCase';

import { GetWilayaUseCase } from './core/usecases/GetWilayaUseCase/GetWilayaUseCase';
import { GetWilayaUseCaseRequest } from './core/usecases/GetWilayaUseCase/GetWilayaUseCaseRequest';

class RegionsManagerFacade {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    getWilaya(request: GetWilayaUseCaseRequest) {
        return new GetWilayaUseCase(this.wilayasRepository).handle(request);
    }

    getAllWilayas() {
        return new GetAllWilayasUseCase(this.wilayasRepository).handle();
    }
}

export { RegionsManagerFacade };
