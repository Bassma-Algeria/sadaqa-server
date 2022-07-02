import { CreateNewPostUseCase } from './core/usecases/CreateNewPostUseCase/CreateNewPostUseCase';
import { CreateNewPostUseCaseRequest } from './core/usecases/CreateNewPostUseCase/CreateNewPostUseCaseRequest';

import { GetPostByIdUseCase } from './core/usecases/GetPostByIdUseCase/GetPostByIdUseCase';
import { GetPostByIdUseCaseRequest } from './core/usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';

class PostsManagerFacade {
  createNewPost(request: CreateNewPostUseCaseRequest) {
    return new CreateNewPostUseCase().handle(request);
  }

  getById(request: GetPostByIdUseCaseRequest) {
    return new GetPostByIdUseCase().handle(request);
  }
}

export { PostsManagerFacade };
