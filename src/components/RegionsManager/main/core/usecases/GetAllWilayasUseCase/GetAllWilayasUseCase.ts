import { UseCase } from '../UseCase';
import { GetAllWilayasUseCaseResponse } from './GetAllWilayasUseCaseReponse';

import { WilayasRepository } from '../../domain/services/WilayasRepository';

class GetAllWilayasUseCase implements UseCase<void, GetAllWilayasUseCaseResponse> {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(): Promise<GetAllWilayasUseCaseResponse> {
        const wilayas = await this.wilayasRepository.getAll();

        return wilayas.map(wilaya => ({
            code: wilaya.code.value(),
            name: wilaya.name.value(),
        }));
    }
}

export { GetAllWilayasUseCase };
