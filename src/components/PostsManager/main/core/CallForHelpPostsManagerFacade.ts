import { UsersService } from './domain/services/UsersService';
import { WilayasService } from './domain/services/WilayasService';
import { PicturesManager } from './domain/services/PicturesManager';
import { PostIdGenerator } from './domain/services/PostIdGenerator';
import { PostShareRepository } from './domain/services/PostRepository/PostShareRepository';
import { FavouritePostRepository } from './domain/services/PostRepository/FavouritePostRepository';
import { CallForHelpPostRepository } from './domain/services/PostRepository/CallForHelpPostRepository';
import { CallForHelpPostEventPublisher } from './domain/services/PostEventPublisher/CallForHelpPostEventPublisher';

import { DeletePostUseCase } from './usecases/DeletePostUseCase/DeletePostUseCase';
import { DeletePostUseCaseRequest } from './usecases/DeletePostUseCase/DeletePostUseCaseRequest';

import { UpdateCallForHelpPostUseCase } from './usecases/UpdatePostUseCases/UpdateCallForHelpPostUseCase/UpdateCallForHelpPostUseCase';
import { UpdateCallForHelpPostUseCaseRequest } from './usecases/UpdatePostUseCases/UpdateCallForHelpPostUseCase/UpdateCallForHelpPostUseCaseRequest';

import { GetCallForHelpPostsListUseCase } from './usecases/GetPostsListUseCases/GetCallForHelpPostsListUseCase/GetCallForHelpPostsListUseCase';
import { GetCallForHelpPostsListUseCaseRequest } from './usecases/GetPostsListUseCases/GetCallForHelpPostsListUseCase/GetCallForHelpPostsListUseCaseRequest';

import { CreateCallForHelpPostUseCase } from './usecases/CreatePostUseCases/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCase';
import { CreateCallForHelpPostUseCaseRequest } from './usecases/CreatePostUseCases/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';

import { TogglePostEnablingStatusUseCase } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCase';
import { TogglePostEnablingStatusUseCaseRequest } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';

import { GetPostByIdUseCase } from './usecases/GetPostByIdUseCase/GetPostByIdUseCase';
import { GetPostByIdUseCaseRequest } from './usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';

import { SearchForPostsUseCase } from './usecases/SearchForPostsUseCase/SearchForPostsUseCase';
import { SearchForPostsUseCaseRequest } from './usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';

import { GetPostsByPublisherUseCase } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCase';
import { GetPostsByPublisherUseCaseRequest } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCaseRequest';

import { CallForHelpPostDto } from './usecases/_common_/dtos/CallForHelpPostDto';
import { CallForHelpPostDtoMapper } from './usecases/_common_/dtos/CallForHelpPostDtoMapper';

import { GetPostsSummaryByPublisherUseCase } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCase';
import { GetPostsSummaryByPublisherUseCaseRequest } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCaseRequest';

import { SharePostUseCase } from './usecases/SharePostUseCase/SharePostUseCase';
import { SharePostUseCaseRequest } from './usecases/SharePostUseCase/SharePostUseCaseRequest';

class CallForHelpPostsManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly wilayasService: WilayasService,
        private readonly picturesManager: PicturesManager,
        private readonly postIdGenerator: PostIdGenerator,
        private readonly postShareRepository: PostShareRepository,
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly callForHelpPostRepository: CallForHelpPostRepository,
        private readonly callForHelpPostEventPublisher: CallForHelpPostEventPublisher,
    ) {}

    create(request: CreateCallForHelpPostUseCaseRequest) {
        return new CreateCallForHelpPostUseCase(
            this.usersService,
            this.wilayasService,
            this.postIdGenerator,
            this.picturesManager,
            this.callForHelpPostRepository,
            this.callForHelpPostEventPublisher,
        ).handle(request);
    }

    update(request: UpdateCallForHelpPostUseCaseRequest) {
        return new UpdateCallForHelpPostUseCase(
            this.wilayasService,
            this.picturesManager,
            this.callForHelpPostRepository,
            this.callForHelpPostEventPublisher,
        ).handle(request);
    }

    toggleEnablingStatus(request: TogglePostEnablingStatusUseCaseRequest) {
        return new TogglePostEnablingStatusUseCase(
            this.callForHelpPostRepository,
            this.callForHelpPostEventPublisher,
        ).handle(request);
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return new GetPostByIdUseCase(
            CallForHelpPostDtoMapper.getInstance(),
            this.callForHelpPostRepository,
        ).handle(request) as Promise<CallForHelpPostDto>;
    }

    getByPublisherId(request: GetPostsByPublisherUseCaseRequest) {
        return new GetPostsByPublisherUseCase(
            this.usersService,
            CallForHelpPostDtoMapper.getInstance(),
            this.callForHelpPostRepository,
        ).handle(request) as Promise<{ list: CallForHelpPostDto[] }>;
    }

    getSummaryByPublisherId(request: GetPostsSummaryByPublisherUseCaseRequest) {
        return new GetPostsSummaryByPublisherUseCase(
            this.usersService,
            CallForHelpPostDtoMapper.getInstance(),
            this.callForHelpPostRepository,
        ).handle(request);
    }

    getList(request?: GetCallForHelpPostsListUseCaseRequest) {
        return new GetCallForHelpPostsListUseCase(this.callForHelpPostRepository).handle(request);
    }

    delete(request: DeletePostUseCaseRequest) {
        return new DeletePostUseCase(
            this.callForHelpPostRepository,
            this.callForHelpPostEventPublisher,
            this.favouritePostRepository,
        ).handle(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return new SearchForPostsUseCase(
            CallForHelpPostDtoMapper.getInstance(),
            this.callForHelpPostRepository,
        ).handle(request) as Promise<{
            page: number;
            total: number;
            end: boolean;
            list: CallForHelpPostDto[];
        }>;
    }

    share(request: SharePostUseCaseRequest) {
        return new SharePostUseCase(
            this.usersService,
            this.callForHelpPostRepository,
            this.postShareRepository,
            this.callForHelpPostEventPublisher,
        ).handle(request);
    }
}

export { CallForHelpPostsManagerFacade };
