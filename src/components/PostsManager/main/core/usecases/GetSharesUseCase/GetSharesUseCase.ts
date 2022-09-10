import { UseCase } from '../UseCase';
import { GetSharesUseCaseRequest } from './GetSharesUseCaseRequest';
import { GetSharesUseCaseResponse } from './GetSharesUseCaseResponse';

import { PostShareRepository } from '../../domain/services/PostRepository/PostShareRepository';

class GetSharesUseCase implements UseCase<GetSharesUseCaseRequest, GetSharesUseCaseResponse> {
    constructor(private readonly postShareRepository: PostShareRepository) {}

    async handle(request?: GetSharesUseCaseRequest): Promise<GetSharesUseCaseResponse> {
        const shares = await this.postShareRepository.findMany();

        return { list: shares.map(share => share.state) };
    }
}

export { GetSharesUseCase };
