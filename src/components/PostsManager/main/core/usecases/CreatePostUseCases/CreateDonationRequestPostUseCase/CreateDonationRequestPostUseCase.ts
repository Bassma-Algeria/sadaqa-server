import { UseCase } from '../../UseCase';
import { CreateDonationRequestPostUseCaseRequest } from './CreateDonationRequestPostUseCaseRequest';
import { CreateDonationRequestPostUseCaseResponse } from './CreateDonationRequestPostUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostStatus } from '../../../domain/PostStatus';
import { CreatePostUseCase } from '../base/CreatePostUseCase';
import { DonationCategory } from '../../../domain/DonationCategory';
import { DonationRequestPost } from '../../../domain/DonationRequestPost';
import { DonationRequestPostBuilder } from '../../../domain/DonationRequestPostBuilder';

import { UsersService } from '../../../domain/services/UsersService';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { DonationRequestPostRepository } from '../../../domain/services/PostRepository/DonationRequestPostRepository';
import { DonationRequestPostEventPublisher } from '../../../domain/services/PostEventPublisher/DonationRequestPostEventPublisher';

class CreateDonationRequestPostUseCase
    extends CreatePostUseCase
    implements
        UseCase<CreateDonationRequestPostUseCaseRequest, CreateDonationRequestPostUseCaseResponse>
{
    constructor(
        usersService: UsersService,
        wilayasService: WilayasService,
        postIdGenerator: PostIdGenerator,
        picturesManager: PicturesManager,
        donationRequestPostRepository: DonationRequestPostRepository,
        donationRequestPostEventPublisher: DonationRequestPostEventPublisher,
    ) {
        super(
            usersService,
            wilayasService,
            postIdGenerator,
            picturesManager,
            donationRequestPostRepository,
            donationRequestPostEventPublisher,
        );
    }

    async handle(
        request: CreateDonationRequestPostUseCaseRequest,
    ): Promise<CreateDonationRequestPostUseCaseResponse> {
        const postBuilder = await this.validatePostInfoAndGetHydratedPostBuilderFrom(request);

        const category = new DonationCategory(request.category);

        const post = (postBuilder as DonationRequestPostBuilder).withCategory(category).build();

        await this.savePost(post);

        this.publishPostCreatedEvent(post);

        return { postId: post.postId.value() };
    }

    protected getInitialPostStatus(): PostStatus {
        return PostStatus.ENABLED;
    }

    protected isPublisherAuthorized(id: UserId): Promise<boolean> {
        return this.usersService.isExist(id);
    }

    protected getEmptyPostBuilder() {
        return DonationRequestPost.aBuilder();
    }
}

export { CreateDonationRequestPostUseCase };
