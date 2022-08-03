import { UseCase } from '../../UseCase';
import { UpdateCallForHelpPostUseCaseRequest } from './UpdateCallForHelpPostUseCaseRequest';
import { UpdateCallForHelpPostUseCaseResponse } from './UpdateCallForHelpPostUseCaseResponse';

import { CCP } from '../../../domain/CCP';
import { BaridiMobNumber } from '../../../domain/BaridiMobNumber';
import { CallForHelpPost } from '../../../domain/CallForHelpPost';
import { CallForHelpPostBuilder } from '../../../domain/CallForHelpPostBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { CallForHelpPostRepository } from '../../../domain/services/PostRepository/CallForHelpPostRepository';
import { CallForHelpPostEventPublisher } from '../../../domain/services/PostEventPublisher/CallForHelpPostEventPublisher';

import { CallForHelpPostDtoMapper } from '../../_common_/dtos/CallForHelpPostDtoMapper';

import { UpdatePostUseCase } from '../base/UpdatePostUseCase';

class UpdateCallForHelpPostUseCase
    extends UpdatePostUseCase
    implements UseCase<UpdateCallForHelpPostUseCaseRequest, UpdateCallForHelpPostUseCaseResponse>
{
    constructor(
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        callForHelpPostRepository: CallForHelpPostRepository,
        callForHelpPostEventPublisher: CallForHelpPostEventPublisher,
    ) {
        super(
            wilayasService,
            picturesManager,
            callForHelpPostRepository,
            callForHelpPostEventPublisher,
        );
    }

    async handle(
        request: UpdateCallForHelpPostUseCaseRequest,
    ): Promise<UpdateCallForHelpPostUseCaseResponse> {
        const postBuilder = await this.processAndValidatePostInfoAndGetHydratedPostBuilderFrom(
            request,
        );

        const ccp = this.getCCPFrom(request);
        const baridiMobNumber = this.getBaridiMobNumberFrom(request);

        const updatedPost = (postBuilder as CallForHelpPostBuilder)
            .withCCP(ccp)
            .withBaridiMobNumber(baridiMobNumber)
            .build();

        await this.updatePost(updatedPost);

        this.publishPostUpdatedEvent(updatedPost);

        return CallForHelpPostDtoMapper.getInstance().toDto(updatedPost);
    }

    private getCCPFrom(request: UpdateCallForHelpPostUseCaseRequest) {
        let ccp: CCP | undefined;

        if (request.ccp || request.ccpKey) {
            ccp = new CCP(request.ccp!, request.ccpKey!);
        }

        return ccp;
    }

    private getBaridiMobNumberFrom(request: UpdateCallForHelpPostUseCaseRequest) {
        let baridiMobNumber: BaridiMobNumber | undefined;

        if (request.baridiMobNumber) {
            baridiMobNumber = new BaridiMobNumber(request.baridiMobNumber);
        }

        return baridiMobNumber;
    }

    protected getPostBuilderFrom(post: CallForHelpPost) {
        return CallForHelpPost.aBuilderFrom(post);
    }
}

export { UpdateCallForHelpPostUseCase };
