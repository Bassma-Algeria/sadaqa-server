import { UsersService } from './domain/services/UsersService';
import { WilayasService } from './domain/services/WilayasService';
import { PicturesManager } from './domain/services/PicturesManager';
import { PostIdGenerator } from './domain/services/PostIdGenerator';
import { DonationPostRepository } from './domain/services/PostRepository/DonationPostRepository';
import { DonationPostEventPublisher } from './domain/services/PostEventPublisher/DonationPostEventPublisher';

import { UpdateDonationPostUseCase } from './usecases/UpdatePostUseCases/UpdateDonationPostUseCase/UpdateDonationPostUseCase';
import { UpdateDonationPostUseCaseRequest } from './usecases/UpdatePostUseCases/UpdateDonationPostUseCase/UpdateDonationPostUseCaseRequest';

import { GetDonationPostsListUseCase } from './usecases/GetPostsListUseCases/GetDonationPostsListUseCase/GetDonationPostsListUseCase';
import { GetDonationPostsListUseCaseRequest } from './usecases/GetPostsListUseCases/GetDonationPostsListUseCase/GetDonationPostsListUseCaseRequest';

import { CreateDonationPostUseCase } from './usecases/CreatePostUseCases/CreateDonationPostUseCase/CreateDonationPostUseCase';
import { CreateDonationPostUseCaseRequest } from './usecases/CreatePostUseCases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';

import { DeletePostUseCase } from './usecases/DeletePostUseCase/DeletePostUseCase';
import { DeletePostUseCaseRequest } from './usecases/DeletePostUseCase/DeletePostUseCaseRequest';

import { TogglePostEnablingStatusUseCase } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCase';
import { TogglePostEnablingStatusUseCaseRequest } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';

import { GetPostByIdUseCase } from './usecases/GetPostByIdUseCase/GetPostByIdUseCase';
import { GetPostByIdUseCaseRequest } from './usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';

import { SearchForPostsUseCase } from './usecases/SearchForPostsUseCase/SearchForPostsUseCase';
import { SearchForPostsUseCaseRequest } from './usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';

import { GetPostsByPublisherUseCase } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCase';
import { GetPostsByPublisherUseCaseRequest } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCaseRequest';

import { DonationPostDto } from './usecases/_common_/dtos/DonationPostDto';
import { DonationPostDtoMapper } from './usecases/_common_/dtos/DonationPostDtoMapper';

class DonationPostsManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly wilayasService: WilayasService,
        private readonly picturesManager: PicturesManager,
        private readonly postIdGenerator: PostIdGenerator,
        private readonly donationPostRepository: DonationPostRepository,
        private readonly donationPostEventPublisher: DonationPostEventPublisher,
    ) {}

    create(request: CreateDonationPostUseCaseRequest) {
        return new CreateDonationPostUseCase(
            this.usersService,
            this.wilayasService,
            this.picturesManager,
            this.postIdGenerator,
            this.donationPostRepository,
            this.donationPostEventPublisher,
        ).handle(request);
    }

    update(request: UpdateDonationPostUseCaseRequest) {
        return new UpdateDonationPostUseCase(
            this.wilayasService,
            this.picturesManager,
            this.donationPostRepository,
            this.donationPostEventPublisher,
        ).handle(request);
    }

    toggleEnablingStatus(request: TogglePostEnablingStatusUseCaseRequest) {
        return new TogglePostEnablingStatusUseCase(
            this.donationPostRepository,
            this.donationPostEventPublisher,
        ).handle(request);
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return new GetPostByIdUseCase(
            DonationPostDtoMapper.getInstance(),
            this.donationPostRepository,
        ).handle(request) as Promise<DonationPostDto>;
    }

    getByPublisherId(request: GetPostsByPublisherUseCaseRequest) {
        return new GetPostsByPublisherUseCase(
            this.usersService,
            DonationPostDtoMapper.getInstance(),
            this.donationPostRepository,
        ).handle(request) as Promise<{ list: DonationPostDto[] }>;
    }

    getList(request?: GetDonationPostsListUseCaseRequest) {
        return new GetDonationPostsListUseCase(this.donationPostRepository).handle(request);
    }

    delete(request: DeletePostUseCaseRequest) {
        return new DeletePostUseCase(
            this.donationPostRepository,
            this.donationPostEventPublisher,
        ).handle(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return new SearchForPostsUseCase(
            DonationPostDtoMapper.getInstance(),
            this.donationPostRepository,
        ).handle(request) as Promise<{
            page: number;
            total: number;
            end: boolean;
            list: DonationPostDto[];
        }>;
    }
}

export { DonationPostsManagerFacade };
