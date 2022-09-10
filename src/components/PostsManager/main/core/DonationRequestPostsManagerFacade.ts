import { UsersService } from './domain/services/UsersService';
import { WilayasService } from './domain/services/WilayasService';
import { PicturesManager } from './domain/services/PicturesManager';
import { PostIdGenerator } from './domain/services/PostIdGenerator';
import { SharePostUseCase } from './usecases/SharePostUseCase/SharePostUseCase';
import { FavouritePostRepository } from './domain/services/PostRepository/FavouritePostRepository';
import { DonationRequestPostRepository } from './domain/services/PostRepository/DonationRequestPostRepository';
import { DonationRequestPostEventPublisher } from './domain/services/PostEventPublisher/DonationRequestPostEventPublisher';

import { GetDonationRequestPostsListUseCase } from './usecases/GetPostsListUseCases/GetDonationRequestPostsListUseCase/GetDonationRequestPostsListUseCase';
import { GetDonationRequestPostsListUseCaseRequest } from './usecases/GetPostsListUseCases/GetDonationRequestPostsListUseCase/GetDonationRequestPostsListUseCaseRequest';

import { UpdateDonationRequestPostUseCase } from './usecases/UpdatePostUseCases/UpdateDonationRequestPostUseCase/UpdateDonationRequestPostUseCase';
import { UpdateDonationRequestPostUseCaseRequest } from './usecases/UpdatePostUseCases/UpdateDonationRequestPostUseCase/UpdateDonationRequestPostUseCaseRequest';

import { CreateDonationRequestPostUseCase } from './usecases/CreatePostUseCases/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCase';
import { CreateDonationRequestPostUseCaseRequest } from './usecases/CreatePostUseCases/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';

import { DeletePostUseCase } from './usecases/DeletePostUseCase/DeletePostUseCase';
import { DeletePostUseCaseRequest } from './usecases/DeletePostUseCase/DeletePostUseCaseRequest';

import { TogglePostEnablingStatusUseCase } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCase';
import { TogglePostEnablingStatusUseCaseRequest } from './usecases/TogglePostEnablingStatusUseCase/TogglePostEnablingStatusUseCaseRequest';

import { GetPostByIdUseCase } from './usecases/GetPostByIdUseCase/GetPostByIdUseCase';
import { GetPostByIdUseCaseRequest } from './usecases/GetPostByIdUseCase/GetPostByIdUseCaseRequest';

import { DonationRequestPostDto } from './usecases/_common_/dtos/DonationRequestPostDto';
import { DonationRequestPostDtoMapper } from './usecases/_common_/dtos/DonationRequestPostDtoMapper';

import { SearchForPostsUseCase } from './usecases/SearchForPostsUseCase/SearchForPostsUseCase';
import { SearchForPostsUseCaseRequest } from './usecases/SearchForPostsUseCase/SearchForPostsUseCaseRequest';

import { GetPostsByPublisherUseCase } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCase';
import { GetPostsByPublisherUseCaseRequest } from './usecases/GetPostsByPublisherUseCase/GetPostsByPublisherUseCaseRequest';

import { GetPostsSummaryByPublisherUseCase } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCase';
import { GetPostsSummaryByPublisherUseCaseRequest } from './usecases/GetPostsSummaryByPublisherUseCase/GetPostsSummaryByPublisherUseCaseRequest';

import { PostShareRepository } from './domain/services/PostRepository/PostShareRepository';
import { SharePostUseCaseRequest } from './usecases/SharePostUseCase/SharePostUseCaseRequest';

class DonationRequestPostsManagerFacade {
    constructor(
        private readonly usersService: UsersService,
        private readonly wilayasService: WilayasService,
        private readonly picturesManager: PicturesManager,
        private readonly postIdGenerator: PostIdGenerator,
        private readonly postShareRepository: PostShareRepository,
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly donationRequestPostRepository: DonationRequestPostRepository,
        private readonly donationRequestPostEventPublisher: DonationRequestPostEventPublisher,
    ) {}

    create(request: CreateDonationRequestPostUseCaseRequest) {
        return new CreateDonationRequestPostUseCase(
            this.usersService,
            this.wilayasService,
            this.postIdGenerator,
            this.picturesManager,
            this.donationRequestPostRepository,
            this.donationRequestPostEventPublisher,
        ).handle(request);
    }

    update(request: UpdateDonationRequestPostUseCaseRequest) {
        return new UpdateDonationRequestPostUseCase(
            this.wilayasService,
            this.picturesManager,
            this.donationRequestPostRepository,
            this.donationRequestPostEventPublisher,
        ).handle(request);
    }

    toggleEnablingStatus(request: TogglePostEnablingStatusUseCaseRequest) {
        return new TogglePostEnablingStatusUseCase(
            this.donationRequestPostRepository,
            this.donationRequestPostEventPublisher,
        ).handle(request);
    }

    getById(request: GetPostByIdUseCaseRequest) {
        return new GetPostByIdUseCase(
            DonationRequestPostDtoMapper.getInstance(),
            this.donationRequestPostRepository,
        ).handle(request) as Promise<DonationRequestPostDto>;
    }

    getByPublisherId(request: GetPostsByPublisherUseCaseRequest) {
        return new GetPostsByPublisherUseCase(
            this.usersService,
            DonationRequestPostDtoMapper.getInstance(),
            this.donationRequestPostRepository,
        ).handle(request) as Promise<{ list: DonationRequestPostDto[] }>;
    }

    getSummaryByPublisherId(request: GetPostsSummaryByPublisherUseCaseRequest) {
        return new GetPostsSummaryByPublisherUseCase(
            this.usersService,
            DonationRequestPostDtoMapper.getInstance(),
            this.donationRequestPostRepository,
        ).handle(request);
    }

    getList(request?: GetDonationRequestPostsListUseCaseRequest) {
        return new GetDonationRequestPostsListUseCase(this.donationRequestPostRepository).handle(
            request,
        );
    }

    delete(request: DeletePostUseCaseRequest) {
        return new DeletePostUseCase(
            this.donationRequestPostRepository,
            this.donationRequestPostEventPublisher,
            this.favouritePostRepository,
        ).handle(request);
    }

    search(request: SearchForPostsUseCaseRequest) {
        return new SearchForPostsUseCase(
            DonationRequestPostDtoMapper.getInstance(),
            this.donationRequestPostRepository,
        ).handle(request) as Promise<{
            page: number;
            total: number;
            end: boolean;
            list: DonationRequestPostDto[];
        }>;
    }

    share(request: SharePostUseCaseRequest) {
        return new SharePostUseCase(
            this.usersService,
            this.donationRequestPostRepository,
            this.postShareRepository,
            this.donationRequestPostEventPublisher,
        ).handle(request);
    }
}

export { DonationRequestPostsManagerFacade };
