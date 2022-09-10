import { UseCase } from '../UseCase';
import { GetAllWilayasUseCaseResponse } from './GetAllWilayasUseCaseReponse';

import { WilayasRepository } from '../../domain/services/WilayasRepository';

class GetAllWilayasUseCase implements UseCase<void, GetAllWilayasUseCaseResponse> {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(): Promise<GetAllWilayasUseCaseResponse> {
        const wilayas = await this.wilayasRepository.getAll();

        return {
            wilayas: wilayas.map(wilaya => ({
                code: wilaya.wilayaNumber.value(),
                name: wilaya.wilayaName.value(),
            })),
        };
    }
}

export { GetAllWilayasUseCase };
