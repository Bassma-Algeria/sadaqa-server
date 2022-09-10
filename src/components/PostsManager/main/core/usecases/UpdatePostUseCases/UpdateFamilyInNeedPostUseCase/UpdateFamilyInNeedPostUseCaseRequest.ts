import { UpdatePostUseCaseRequest } from '../base/UpdatePostUseCaseRequest';

export interface UpdateFamilyInNeedPostUseCaseRequest extends UpdatePostUseCaseRequest {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
