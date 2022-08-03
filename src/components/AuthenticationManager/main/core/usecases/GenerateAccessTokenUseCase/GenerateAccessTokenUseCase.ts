import { UseCase } from '../UseCase';
import { GenerateAccessTokenUseCaseRequest } from './GenerateAccessTokenUseCaseRequest';
import { GenerateAccessTokenUseCaseResponse } from './GenerateAccessTokenUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { AccessToken } from '../../domain/AccessToken';
import { TokenizationService } from '../../domain/services/TokenizationService';

class GenerateAccessTokenUseCase
    implements UseCase<GenerateAccessTokenUseCaseRequest, GenerateAccessTokenUseCaseResponse>
{
    constructor(private readonly tokenizationService: TokenizationService) {}

    async handle({
        userId,
    }: GenerateAccessTokenUseCaseRequest): Promise<GenerateAccessTokenUseCaseResponse> {
        const token = await this.tokenizationService.generateTokenFrom(new UserId(userId));

        const accessToken = new AccessToken(token);

        return { accessToken: accessToken.value() };
    }
}

export { GenerateAccessTokenUseCase };
