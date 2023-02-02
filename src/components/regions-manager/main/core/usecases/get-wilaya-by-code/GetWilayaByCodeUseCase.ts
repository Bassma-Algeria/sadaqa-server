import { UseCase } from '../UseCase';
import { GetWilayaByCodeUseCaseRequest } from './GetWilayaByCodeUseCaseRequest';
import { GetWilayaByCodeUseCaseResponse } from './GetWilayaByCodeUseCaseResponse';

import { WilayaCode } from '../../domain/WilayaCode';
import { WilayasRepository } from '../../domain/repositories/WilayasRepository';
import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { RegionsExceptionMessages } from '../../domain/exceptions/RegionsExceptionMessages';

class GetWilayaByCodeUseCase
    implements UseCase<GetWilayaByCodeUseCaseRequest, GetWilayaByCodeUseCaseResponse>
{
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(request: GetWilayaByCodeUseCaseRequest): Promise<GetWilayaByCodeUseCaseResponse> {
        const wilayaNumber = new WilayaCode(request.code);

        const wilaya = await this.wilayasRepository.getByCode(wilayaNumber);

        if (!wilaya) throw new NotFoundException(RegionsExceptionMessages.WILAYA_NOT_FOUND);

        return {
            name: wilaya.name.value(),
            code: wilaya.code.value(),
        };
    }
}

export { GetWilayaByCodeUseCase };
