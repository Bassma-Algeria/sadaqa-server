import { UseCase } from '../UseCase';
import { GetPostByIdUseCaseResponse } from './GetPostByIdUseCaseReponse';
import { GetPostByIdUseCaseRequest } from './GetPostByIdUseCaseRequest';

class GetPostByIdUseCase implements UseCase<GetPostByIdUseCaseRequest, GetPostByIdUseCaseResponse> {
  async handle(request: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    return { title: '' };
  }
}

export { GetPostByIdUseCase };
