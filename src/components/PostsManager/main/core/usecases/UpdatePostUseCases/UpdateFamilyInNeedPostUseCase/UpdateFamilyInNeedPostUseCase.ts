import { UseCase } from '../../UseCase';
import { UpdateFamilyInNeedPostUseCaseRequest } from './UpdateFamilyInNeedPostUseCaseRequest';
import { UpdateFamilyInNeedPostUseCaseResponse } from './UpdateFamilyInNeedPostUseCaseResponse';

import { CCP } from '../../../domain/CCP';
import { BaridiMobNumber } from '../../../domain/BaridiMobNumber';
import { FamilyInNeedPost } from '../../../domain/FamilyInNeedPost';
import { FamilyInNeedPostBuilder } from '../../../domain/FamilyInNeedPostBuilder';

import { WilayasService } from '../../../domain/services/WilayasService';
import { PicturesManager } from '../../../domain/services/PicturesManager';
import { FamilyInNeedPostRepository } from '../../../domain/services/PostRepository/FamilyInNeedPostRepository';
import { FamilyInNeedPostEventPublisher } from '../../../domain/services/PostEventPublisher/FamilyInNeedPostEventPublisher';

import { FamilyInNeedPostDtoMapper } from '../../_common_/dtos/FamilyInNeedPostDtoMapper';

import { UpdatePostUseCase } from '../base/UpdatePostUseCase';

class UpdateFamilyInNeedPostUseCase
    extends UpdatePostUseCase
    implements UseCase<UpdateFamilyInNeedPostUseCaseRequest, UpdateFamilyInNeedPostUseCaseResponse>
{
    constructor(
        wilayasService: WilayasService,
        picturesManager: PicturesManager,
        postRepository: FamilyInNeedPostRepository,
        eventPublisher: FamilyInNeedPostEventPublisher,
    ) {
        super(wilayasService, picturesManager, postRepository, eventPublisher);
    }

    async handle(
        request: UpdateFamilyInNeedPostUseCaseRequest,
    ): Promise<UpdateFamilyInNeedPostUseCaseResponse> {
        const postBuilder = await this.processAndValidatePostInfoAndGetHydratedPostBuilderFrom(
            request,
        );

        const ccp = this.getCCPFrom(request);
        const baridiMobNumber = this.getBaridiMobNumberFrom(request);

        const updatedPost = (postBuilder as FamilyInNeedPostBuilder)
            .withCCP(ccp)
            .withBaridiMobNumber(baridiMobNumber)
            .build();

        await this.updatePost(updatedPost);

        this.publishPostUpdatedEvent(updatedPost);

        return FamilyInNeedPostDtoMapper.getInstance().toDto(updatedPost);
    }

    private getCCPFrom(request: UpdateFamilyInNeedPostUseCaseRequest) {
        let ccp: CCP | null = null;

        if (request.ccp || request.ccpKey) {
            ccp = new CCP(request.ccp!, request.ccpKey!);
        }

        return ccp;
    }

    private getBaridiMobNumberFrom(request: UpdateFamilyInNeedPostUseCaseRequest) {
        let baridiMobNumber: BaridiMobNumber | null = null;

        if (request.baridiMobNumber) {
            baridiMobNumber = new BaridiMobNumber(request.baridiMobNumber);
        }

        return baridiMobNumber;
    }

    protected getPostBuilderFrom(post: FamilyInNeedPost) {
        return FamilyInNeedPost.aBuilderFrom(post);
    }
}

export { UpdateFamilyInNeedPostUseCase };
