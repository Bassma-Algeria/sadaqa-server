import { RegionsManager } from './RegionsManager';

import { WilayasRepository } from './core/domain/services/WilayasRepository';

import { GetAllWilayasUseCase } from './core/usecases/GetAllWilayasUseCase/GetAllWilayasUseCase';

import { GetWilayaUseCase } from './core/usecases/GetWilayaUseCase/GetWilayaUseCase';
import { GetWilayaUseCaseRequest } from './core/usecases/GetWilayaUseCase/GetWilayaUseCaseRequest';

import { InitializeAllRegionsIfNotInitialized } from './core/usecases/InitializeAllRegionsIfNotInitialized/InitializeAllRegionsIfNotInitialized';

import { WilayaDto } from './presenters/WilayaDto';

class RegionsManagerFacade implements RegionsManager {
    private static IsInitialized = false;

    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async getWilaya(request: GetWilayaUseCaseRequest) {
        await this.initRegionsIfNotInitialized();
        return new GetWilayaUseCase(this.wilayasRepository).handle(request);
    }

    async getAllWilayas() {
        await this.initRegionsIfNotInitialized();
        return new GetAllWilayasUseCase(this.wilayasRepository).handle();
    }

    async getAlgerianWilayas(): Promise<WilayaDto[]> {
        await this.initRegionsIfNotInitialized();

        return new GetAllWilayasUseCase(this.wilayasRepository).handle();
    }

    async getWilayaByCode(code: number): Promise<WilayaDto> {
        await this.initRegionsIfNotInitialized();

        return new GetWilayaUseCase(this.wilayasRepository).handle({ code });
    }

    private async initRegionsIfNotInitialized() {
        if (RegionsManagerFacade.IsInitialized) return;

        await new InitializeAllRegionsIfNotInitialized(this.wilayasRepository).handle();

        RegionsManagerFacade.IsInitialized = true;
    }
}

export { RegionsManagerFacade };
