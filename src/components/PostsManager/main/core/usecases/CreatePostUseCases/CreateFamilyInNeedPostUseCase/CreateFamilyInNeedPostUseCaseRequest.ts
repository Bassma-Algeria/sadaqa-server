import { CreatePostUseCaseRequest } from '../base/CreatePostUseCaseRequest';

export interface CreateFamilyInNeedPostUseCaseRequest extends CreatePostUseCaseRequest {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
