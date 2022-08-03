import { UseCase } from '../../UseCase';
import { CreateFamilyInNeedPostUseCaseRequest } from './CreateFamilyInNeedPostUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseResponse } from './CreateFamilyInNeedPostUseCaseResponse';

import { CCP } from '../../../domain/CCP';
import { UserId } from '../../../domain/UserId';
import { PostStatus } from '../../../domain/PostStatus';
import { BaridiMobNumber } from '../../../domain/BaridiMobNumber';
import { FamilyInNeedPost } from '../../../domain/FamilyInNeedPost';
import { FamilyInNeedPostBuilder } from '../../../domain/FamilyInNeedPostBuilder';

import { UsersService } from '../../../domain/services/UsersService';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { FamilyInNeedPostRepository } from '../../../domain/services/PostRepository/FamilyInNeedPostRepository';
import { FamilyInNeedPostEventPublisher } from '../../../domain/services/PostEventPublisher/FamilyInNeedPostEventPublisher';

import { CreatePostUseCase } from '../base/CreatePostUseCase';

class CreateFamilyInNeedPostUseCase
    extends CreatePostUseCase
    implements UseCase<CreateFamilyInNeedPostUseCaseRequest, CreateFamilyInNeedPostUseCaseResponse>
{
    constructor(
        usersService: UsersService,
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        postIdGenerator: PostIdGenerator,
        familyInNeedPostRepository: FamilyInNeedPostRepository,
        familyInNeedPostEventPublisher: FamilyInNeedPostEventPublisher,
    ) {
        super(
            usersService,
            wilayasService,
            postIdGenerator,
            picturesManager,
            familyInNeedPostRepository,
            familyInNeedPostEventPublisher,
        );
    }

    async handle(
        request: CreateFamilyInNeedPostUseCaseRequest,
    ): Promise<CreateFamilyInNeedPostUseCaseResponse> {
        const postBuilder = await this.validatePostInfoAndGetHydratedPostBuilderFrom(request);

        const baridiMobNumber = this.getBaridiMobNumberFrom(request);
        const ccp = this.getCCPFrom(request);

        const post = (postBuilder as FamilyInNeedPostBuilder)
            .withCCP(ccp)
            .withBaridiMobNumber(baridiMobNumber)
            .build();

        await this.savePost(post);

        this.publishPostCreatedEvent(post);

        return { postId: post.postId.value() };
    }

    private getCCPFrom(request: CreateFamilyInNeedPostUseCaseRequest) {
        let ccp: CCP | undefined;

        if (request.ccp || request.ccpKey) {
            ccp = new CCP(request.ccp!, request.ccpKey!);
        }

        return ccp;
    }

    private getBaridiMobNumberFrom(request: CreateFamilyInNeedPostUseCaseRequest) {
        let baridiMobNumber: BaridiMobNumber | undefined;

        if (request.baridiMobNumber) {
            baridiMobNumber = new BaridiMobNumber(request.baridiMobNumber);
        }

        return baridiMobNumber;
    }

    protected getInitialPostStatus(): PostStatus {
        return PostStatus.ENABLED;
    }

    protected isPublisherAuthorized(id: UserId): Promise<boolean> {
        return this.usersService.isActiveAssociation(id);
    }

    protected getEmptyPostBuilder() {
        return FamilyInNeedPost.aBuilder();
    }
}

export { CreateFamilyInNeedPostUseCase };
