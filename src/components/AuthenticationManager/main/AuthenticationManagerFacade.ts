import { TokenizationService } from './core/domain/services/TokenizationService';

import { DecodeAccessTokenUseCase } from './core/usecases/DecodeAccessTokenUseCase/DecodeAccessTokenUseCase';
import { DecodeAccessTokenUseCaseRequest } from './core/usecases/DecodeAccessTokenUseCase/DecodeAccessTokenUseCaseRequest';

import { GenerateAccessTokenUseCase } from './core/usecases/GenerateAccessTokenUseCase/GenerateAccessTokenUseCase';
import { GenerateAccessTokenUseCaseRequest } from './core/usecases/GenerateAccessTokenUseCase/GenerateAccessTokenUseCaseRequest';

class AuthenticationManagerFacade {
  constructor(private readonly tokenizationService: TokenizationService) {}

  decodeAccessToken(request: DecodeAccessTokenUseCaseRequest) {
    return new DecodeAccessTokenUseCase(this.tokenizationService).handle(request);
  }

  generateAccessToken(request: GenerateAccessTokenUseCaseRequest) {
    return new GenerateAccessTokenUseCase(this.tokenizationService).handle(request);
  }
}

export { AuthenticationManagerFacade };
