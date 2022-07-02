import { WilayasRepository } from './domain/services/WilayasRepository';
import { GetAllWilayasUseCase } from './usecases/GetAllWilayasUseCase/GetAllWilayasUseCase';
import { GetWilayaUseCase } from './usecases/GetWilayaUseCase/GetWilayaUseCase';
import { GetWilayaUseCaseRequest } from './usecases/GetWilayaUseCase/GetWilayaUseCaseRequest';

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
