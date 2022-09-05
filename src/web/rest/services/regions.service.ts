import { Injectable } from '@nestjs/common';

import { RegionsManagerConfiguration } from '../../../components/RegionsManager/main/RegionsManagerConfiguration';
import { GetWilayaUseCaseRequest } from '../../../components/RegionsManager/main/core/usecases/GetWilayaUseCase/GetWilayaUseCaseRequest';

import { Service } from './base/base.service';

@Injectable()
class RegionsService extends Service {
    private readonly regionsManager = RegionsManagerConfiguration.aRegionsManagerFacade();

    async getAllWilayas() {
        try {
            return await this.regionsManager.getAllWilayas();
        } catch (e) {
            await this.logError('Error while getting the wilayas', e);

            throw e;
        }
    }

    async getWilaya(request: GetWilayaUseCaseRequest) {
        try {
            return await this.regionsManager.getWilaya(request);
        } catch (e) {
            await this.logError('Error while getting the wilaya', e);

            throw e;
        }
    }
}

export { RegionsService };

