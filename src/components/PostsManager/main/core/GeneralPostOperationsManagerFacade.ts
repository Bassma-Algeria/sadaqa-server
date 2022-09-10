import { PostShareRepository } from './domain/services/PostRepository/PostShareRepository';

import { GetSharesUseCase } from './usecases/GetSharesUseCase/GetSharesUseCase';
import { GetSharesUseCaseRequest } from './usecases/GetSharesUseCase/GetSharesUseCaseRequest';

class GeneralPostOperationsManagerFacade {
    constructor(private readonly postShareRepository: PostShareRepository) {}

    getShares(request?: GetSharesUseCaseRequest) {
        return new GetSharesUseCase(this.postShareRepository).handle(request);
    }
}

export { GeneralPostOperationsManagerFacade };
