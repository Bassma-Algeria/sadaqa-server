import { UseCase } from '../../UseCase';
import { CreateCallForHelpPostUseCaseRequest } from './CreateCallForHelpPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseResponse } from './CreateCallForHelpPostUseCaseResponse';

import { CCP } from '../../../domain/CCP';
import { UserId } from '../../../domain/UserId';
import { PostStatus } from '../../../domain/PostStatus';
import { BaridiMobNumber } from '../../../domain/BaridiMobNumber';
import { CallForHelpPost } from '../../../domain/CallForHelpPost';
import { CallForHelpPostBuilder } from '../../../domain/CallForHelpPostBuilder';

import { UsersService } from '../../../domain/services/UsersService';
import { WilayasService } from '../../../domain/services/WilayasService';
import { PostIdGenerator } from '../../../domain/services/PostIdGenerator';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { CallForHelpPostRepository } from '../../../domain/services/PostRepository/CallForHelpPostRepository';
import { CallForHelpPostEventPublisher } from '../../../domain/services/PostEventPublisher/CallForHelpPostEventPublisher';

import { CreatePostUseCase } from '../base/CreatePostUseCase';

class CreateCallForHelpPostUseCase
    extends CreatePostUseCase
    implements UseCase<CreateCallForHelpPostUseCaseRequest, CreateCallForHelpPostUseCaseResponse>
{
    constructor(
        usersService: UsersService,
        wilayasService: WilayasService,
        postIdGenerator: PostIdGenerator,
        picturesManager: PicturesManager,
        callForHelpPostRepository: CallForHelpPostRepository,
        callForHelpPostEventPublisher: CallForHelpPostEventPublisher,
    ) {
        super(
            usersService,
            wilayasService,
            postIdGenerator,
            picturesManager,
            callForHelpPostRepository,
            callForHelpPostEventPublisher,
        );
    }

    async handle(
        request: CreateCallForHelpPostUseCaseRequest,
    ): Promise<CreateCallForHelpPostUseCaseResponse> {
        const postBuilder = await this.validatePostInfoAndGetHydratedPostBuilderFrom(request);

        const ccp = this.getCCPFrom(request);
        const baridiMobNumber = this.getBaridiMobNumberFrom(request);

        const post = (postBuilder as CallForHelpPostBuilder)
            .withCCP(ccp)
            .withBaridiMobNumber(baridiMobNumber)
            .build();

        await this.savePost(post);

        this.publishPostCreatedEvent(post);

        return { postId: post.state.postId };
    }

    private getCCPFrom(request: CreateCallForHelpPostUseCaseRequest) {
        let ccp: CCP | null = null;

        if (request.ccp || request.ccpKey) {
            ccp = new CCP(request.ccp!, request.ccpKey!);
        }

        return ccp;
    }

    private getBaridiMobNumberFrom(request: CreateCallForHelpPostUseCaseRequest) {
        let baridiMobNumber: BaridiMobNumber | null = null;

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
        return CallForHelpPost.aBuilder();
    }
}

export { CreateCallForHelpPostUseCase };
