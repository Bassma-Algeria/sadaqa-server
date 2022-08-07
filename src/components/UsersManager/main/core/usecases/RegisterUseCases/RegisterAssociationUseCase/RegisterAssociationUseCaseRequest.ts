import { RegisterUseCaseRequest } from '../base/RegisterUseCaseRequest';

export interface RegisterAssociationUseCaseRequest extends RegisterUseCaseRequest {
    associationName: string;
    associationDocs: Buffer[];
}
