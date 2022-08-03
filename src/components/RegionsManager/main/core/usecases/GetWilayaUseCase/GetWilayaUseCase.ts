import { UseCase } from '../UseCase';
import { GetWilayaUseCaseRequest } from './GetWilayaUseCaseRequest';
import { GetWilayaUseCaseResponse } from './GetWilayaUseCaseResponse';

import { WilayaNumber } from '../../domain/WilayaNumber';
import { WilayasRepository } from '../../domain/services/WilayasRepository';
import { WilayaNotExistException } from '../../domain/exceptions/WilayaNotExistException';

class GetWilayaUseCase implements UseCase<GetWilayaUseCaseRequest, GetWilayaUseCaseResponse> {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(request: GetWilayaUseCaseRequest): Promise<GetWilayaUseCaseResponse> {
        const wilayaNumber = new WilayaNumber(request.wilayaNumber);

        const wilaya = await this.getWilayaWithThis(wilayaNumber);
        if (!wilaya) throw new WilayaNotExistException();

        return { name: wilaya.wilayaName.value() };
    }

    private getWilayaWithThis(wilayaNumber: WilayaNumber) {
        return this.wilayasRepository.getByNumber(wilayaNumber);
    }
}

export { GetWilayaUseCase };
