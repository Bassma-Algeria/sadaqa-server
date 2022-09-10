import { UseCase } from '../UseCase';
import { GenerateAccessTokenUseCaseRequest } from './GenerateAccessTokenUseCaseRequest';
import { GenerateAccessTokenUseCaseResponse } from './GenerateAccessTokenUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { BearerToken } from '../../domain/BearerToken';
import { TokenizationService } from '../../domain/services/TokenizationService';

class GenerateAccessTokenUseCase
    implements UseCase<GenerateAccessTokenUseCaseRequest, GenerateAccessTokenUseCaseResponse>
{
    constructor(private readonly tokenizationService: TokenizationService) {}

    async handle({
        userId,
    }: GenerateAccessTokenUseCaseRequest): Promise<GenerateAccessTokenUseCaseResponse> {
        const token = await this.tokenizationService.generateTokenFrom(new UserId(userId));

        const bearerToken = new BearerToken(token);

        return { accessToken: bearerToken.value() };
    }
}

export { GenerateAccessTokenUseCase };
