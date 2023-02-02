import { UseCase } from '../UseCase';
import { GetWilayaUseCaseRequest } from './GetWilayaUseCaseRequest';
import { GetWilayaUseCaseResponse } from './GetWilayaUseCaseResponse';

import { WilayaCode } from '../../domain/WilayaCode';
import { WilayasRepository } from '../../domain/services/WilayasRepository';
import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { RegionsExceptionMessages } from '../../domain/exceptions/RegionsExceptionMessages';

class GetWilayaUseCase implements UseCase<GetWilayaUseCaseRequest, GetWilayaUseCaseResponse> {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(request: GetWilayaUseCaseRequest): Promise<GetWilayaUseCaseResponse> {
        const wilayaNumber = new WilayaCode(request.code);

        const wilaya = await this.wilayasRepository.getByCode(wilayaNumber);

        if (!wilaya) throw new NotFoundException(RegionsExceptionMessages.WILAYA_NOT_FOUND);

        return {
            name: wilaya.name.value(),
            code: wilaya.code.value(),
        };
    }
}

export { GetWilayaUseCase };
