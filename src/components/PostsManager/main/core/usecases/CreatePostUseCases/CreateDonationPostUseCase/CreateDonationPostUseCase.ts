import { UseCase } from '../../UseCase';
import { CreateDonationPostUseCaseRequest } from './CreateDonationPostUseCaseRequest';
import { CreateDonationPostUseCaseResponse } from './CreateDonationPostUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostStatus } from '../../../domain/PostStatus';
import { DonationPost } from '../../../domain/DonationPost';
import { DonationCategory } from '../../../domain/DonationCategory';
import { DonationPostBuilder } from '../../../domain/DonationPostBuilder';

import { UsersService } from '../../../domain/services/UsersService';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { DonationPostRepository } from '../../../domain/services/PostRepository/DonationPostRepository';
import { DonationPostEventPublisher } from '../../../domain/services/PostEventPublisher/DonationPostEventPublisher';

import { CreatePostUseCase } from '../base/CreatePostUseCase';

class CreateDonationPostUseCase
    extends CreatePostUseCase
    implements UseCase<CreateDonationPostUseCaseRequest, CreateDonationPostUseCaseResponse>
{
    constructor(
        usersService: UsersService,
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        postIdGenerator: PostIdGenerator,
        donationPostRepository: DonationPostRepository,
        eventPublisher: DonationPostEventPublisher,
    ) {
        super(
            usersService,
            wilayasService,
            postIdGenerator,
            picturesManager,
            donationPostRepository,
            eventPublisher,
        );
    }

    async handle(
        request: CreateDonationPostUseCaseRequest,
    ): Promise<CreateDonationPostUseCaseResponse> {
        const postBuilder = await this.validatePostInfoAndGetHydratedPostBuilderFrom(request);

        const category = new DonationCategory(request.category);

        const post = (postBuilder as DonationPostBuilder).withCategory(category).build();

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
        return DonationPost.aBuilder();
    }
}

export { CreateDonationPostUseCase };
