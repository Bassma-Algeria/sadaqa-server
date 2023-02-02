import { RegionsManager } from './RegionsManager';

import { WilayasRepository } from './core/domain/repositories/WilayasRepository';

import { GetAllWilayasUseCase } from './core/usecases/get-all-wilayas/GetAllWilayasUseCase';

import { GetWilayaByCodeUseCase } from './core/usecases/get-wilaya-by-code/GetWilayaByCodeUseCase';

import { InitializeAllRegionsIfNotInitializedUseCase } from './core/usecases/Initialize-all-regions-if-not-initialized/InitializeAllRegionsIfNotInitializedUseCase';

import { WilayaDto } from './presenters/WilayaDto';

class RegionsManagerFacade implements RegionsManager {
    private static IsInitialized = false;

    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async getAlgerianWilayas(): Promise<WilayaDto[]> {
        await this.initRegionsIfNotInitialized();

        return new GetAllWilayasUseCase(this.wilayasRepository).handle();
    }

    async getWilayaByCode(code: number): Promise<WilayaDto> {
        await this.initRegionsIfNotInitialized();

        return new GetWilayaByCodeUseCase(this.wilayasRepository).handle({ code });
    }

    private async initRegionsIfNotInitialized() {
        if (RegionsManagerFacade.IsInitialized) return;

        await new InitializeAllRegionsIfNotInitializedUseCase(this.wilayasRepository).handle();

        RegionsManagerFacade.IsInitialized = true;
    }
}

export { RegionsManagerFacade };
