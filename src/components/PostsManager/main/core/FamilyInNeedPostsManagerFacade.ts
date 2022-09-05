import { UsersService } from './domain/services/UsersService';
import { WilayasService } from './domain/services/WilayasService';
import { PicturesManager } from './domain/services/PicturesManager';
import { PostIdGenerator } from './domain/services/PostIdGenerator';
import { PostShareRepository } from './domain/services/PostRepository/PostShareRepository';
import { FavouritePostRepository } from './domain/services/PostRepository/FavouritePostRepository';
import { FamilyInNeedPostRepository } from './domain/services/PostRepository/FamilyInNeedPostRepository';
import { FamilyInNeedPostEventPublisher } from './domain/services/PostEventPublisher/FamilyInNeedPostEventPublisher';

import { UpdateFamilyInNeedPostUseCase } from './usecases/UpdatePostUseCases/UpdateFamilyInNeedPostUseCase/UpdateFamilyInNeedPostUseCase';
import { UpdateFamilyInNeedPostUseCaseRequest } from './usecases/UpdatePostUseCases/UpdateFamilyInNeedPostUseCase/UpdateFamilyInNeedPostUseCaseRequest';

import { CreateFamilyInNeedPostUseCase } from './usecases/CreatePostUseCases/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCase';
import { CreateFamilyInNeedPostUseCaseRequest } from './usecases/CreatePostUseCases/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';

import { GetFamilyInNeedPostsListUseCase } from './usecases/GetPostsListUseCases/GetFamilyInNeedPostsListUseCase/GetFamilyInNeedPostsListUseCase';
import { GetFamilyInNeedPostsListUseCaseRequest } from './usecases/GetPostsListUseCases/GetFamilyInNeedPostsListUseCase/GetFamilyInNeedPostsListUseCaseRequest';

import { DeletePostUseCase } from './usecases/DeletePostUseCase/DeletePostUseCase';
import { DeletePostUseCaseRequest } from './usecases/DeletePostUseCase/DeletePostUseCaseRequest';

import { TogglePostEnablingStatusUseCase } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCase';
import { TogglePostEnablingStatusUseCaseRequest } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';

import { GetPostByIdUseCase } from './usecases/GetPostByIdUseCase/GetPostByIdUseCase';
import { GetPostByIdUseCaseRequest } from './usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';

import { FamilyInNeedPostDto } from './usecases/_common_/dtos/FamilyInNeedPostDto';
import { FamilyInNeedPostDtoMapper } from './usecases/_common_/dtos/FamilyInNeedPostDtoMapper';

import { SearchForPostsUseCase } from './usecases/SearchForPostsUseCase/SearchForPostsUseCase';
import { SearchForPostsUseCaseRequest } from './usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';

import { GetPostsByPublisherUseCase } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCase';
import { GetPostsByPublisherUseCaseRequest } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCaseRequest';

import { GetPostsSummaryByPublisherUseCase } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCase';
import { GetPostsSummaryByPublisherUseCaseRequest } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCaseRequest';

import { SharePostUseCase } from './usecases/SharePostUseCase/SharePostUseCase';
import { SharePostUseCaseRequest } from './usecases/SharePostUseCase/SharePostUseCaseRequest';

class FamilyInNeedPostsManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly wilayasService: WilayasService,
        private readonly picturesManager: PicturesManager,
        private readonly postIdGenerator: PostIdGenerator,
        private readonly postShareRepository: PostShareRepository,
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
        private readonly familyInNeedPostEventPublisher: FamilyInNeedPostEventPublisher,
    ) {}

    create(request: CreateFamilyInNeedPostUseCaseRequest) {
        return new CreateFamilyInNeedPostUseCase(
            this.usersService,
            this.wilayasService,
            this.picturesManager,
            this.postIdGenerator,
            this.familyInNeedPostRepository,
            this.familyInNeedPostEventPublisher,
        ).handle(request);
    }

    update(request: UpdateFamilyInNeedPostUseCaseRequest) {
        return new UpdateFamilyInNeedPostUseCase(
            this.wilayasService,
            this.picturesManager,
            this.familyInNeedPostRepository,
            this.familyInNeedPostEventPublisher,
        ).handle(request);
    }

    toggleEnablingStatus(request: TogglePostEnablingStatusUseCaseRequest) {
        return new TogglePostEnablingStatusUseCase(
            this.familyInNeedPostRepository,
            this.familyInNeedPostEventPublisher,
        ).handle(request);
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return new GetPostByIdUseCase(
            FamilyInNeedPostDtoMapper.getInstance(),
            this.familyInNeedPostRepository,
        ).handle(request) as Promise<FamilyInNeedPostDto>;
    }

    getByPublisherId(request: GetPostsByPublisherUseCaseRequest) {
        return new GetPostsByPublisherUseCase(
            this.usersService,
            FamilyInNeedPostDtoMapper.getInstance(),
            this.familyInNeedPostRepository,
        ).handle(request) as Promise<{ list: FamilyInNeedPostDto[] }>;
    }

    getSummaryByPublisherId(request: GetPostsSummaryByPublisherUseCaseRequest) {
        return new GetPostsSummaryByPublisherUseCase(
            this.usersService,
            FamilyInNeedPostDtoMapper.getInstance(),
            this.familyInNeedPostRepository,
        ).handle(request);
    }

    getList(request?: GetFamilyInNeedPostsListUseCaseRequest) {
        return new GetFamilyInNeedPostsListUseCase(this.familyInNeedPostRepository).handle(request);
    }

    delete(request: DeletePostUseCaseRequest) {
        return new DeletePostUseCase(
            this.familyInNeedPostRepository,
            this.familyInNeedPostEventPublisher,
            this.favouritePostRepository,
        ).handle(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return new SearchForPostsUseCase(
            FamilyInNeedPostDtoMapper.getInstance(),
            this.familyInNeedPostRepository,
        ).handle(request) as Promise<{
            page: number;
            total: number;
            end: boolean;
            list: FamilyInNeedPostDto[];
        }>;
    }

    share(request: SharePostUseCaseRequest) {
        return new SharePostUseCase(
            this.usersService,
            this.familyInNeedPostRepository,
            this.postShareRepository,
            this.familyInNeedPostEventPublisher,
        ).handle(request);
    }
}

export { FamilyInNeedPostsManagerFacade };
