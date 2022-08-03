import { Injectable } from '@nestjs/common';
import { RegionsManagerConfiguration } from '../../../components/RegionsManager/main/RegionsManagerConfiguration';
import { GetWilayaUseCaseRequest } from '../../../components/RegionsManager/main/core/usecases/GetWilayaUseCase/GetWilayaUseCaseRequest';

@Injectable()
class RegionsService {
    private readonly regionsManager = RegionsManagerConfiguration.aRegionsManagerFacade();

    getAllWilayas() {
        return this.regionsManager.getAllWilayas();
    }

    getWilaya(request: GetWilayaUseCaseRequest) {
        return this.regionsManager.getWilaya(request);
    }
}

export { RegionsService };
