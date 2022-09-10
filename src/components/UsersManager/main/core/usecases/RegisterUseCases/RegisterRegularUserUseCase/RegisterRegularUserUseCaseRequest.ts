import { RegisterUseCaseRequest } from '../base/RegisterUseCaseRequest';

interface RegisterRegularUserUseCaseRequest extends RegisterUseCaseRequest {
    readonly firstName: string;
    readonly lastName: string;
}

export { RegisterRegularUserUseCaseRequest };
