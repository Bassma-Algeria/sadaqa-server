import { UseCase } from '../UseCase';
import { DecodeAccessTokenUseCaseRequest } from './DecodeAccessTokenUseCaseRequest';
import { DecodeAccessTokenUseCaseResponse } from './DecodeAccessTokenUseCaseResponse';

import { BearerToken } from '../../domain/BearerToken';

import { TokenizationService } from '../../domain/services/TokenizationService';

class DecodeAccessTokenUseCase
    implements UseCase<DecodeAccessTokenUseCaseRequest, DecodeAccessTokenUseCaseResponse>
{
    constructor(private readonly tokenizationService: TokenizationService) {}

    async handle({
        accessToken: tokenFromRequest,
    }: DecodeAccessTokenUseCaseRequest): Promise<DecodeAccessTokenUseCaseResponse> {
        const accessToken = BearerToken.from(tokenFromRequest);

        const userId = await this.tokenizationService.decodeToken(accessToken.getToken());

        return { userId: userId.value() };
    }
}

export { DecodeAccessTokenUseCase };
