import { UpdatePostUseCaseRequest } from '../base/UpdatePostUseCaseRequest';

export interface UpdateCallForHelpPostUseCaseRequest extends UpdatePostUseCaseRequest {
    readonly ccp?: string;
    readonly ccpKey?: string;
    readonly baridiMobNumber?: string;
}
