import { UseCase } from '../UseCase';
import { CreateNewPostUseCaseRequest } from './CreateNewPostUseCaseRequest';
import { CreateNewPostUseCaseResponse } from './CreateNewPostUseCaseResponse';

class CreateNewPostUseCase
  implements UseCase<CreateNewPostUseCaseRequest, CreateNewPostUseCaseResponse>
{
  async handle(request: CreateNewPostUseCaseRequest): Promise<CreateNewPostUseCaseResponse> {
    return { postId: '' };
  }
}

export { CreateNewPostUseCase };
