import { CreatePostUseCaseRequest } from '../base/CreatePostUseCaseRequest';

export interface CreateCallForHelpPostUseCaseRequest extends CreatePostUseCaseRequest {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
