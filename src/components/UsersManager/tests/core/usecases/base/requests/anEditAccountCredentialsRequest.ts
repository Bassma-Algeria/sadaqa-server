import { EditAccountCredentialsUseCaseRequest } from '../../../../../main/core/usecases/EditAccountCredentialsUseCases/base/EditAccountCredentialsUseCaseRequest';
import { faker } from '@faker-js/faker';

const anEditAccountCredentialsRequest = (
    request?: Partial<EditAccountCredentialsUseCaseRequest>,
): EditAccountCredentialsUseCaseRequest => {
    return {
        accountId: faker.datatype.uuid(),
        email: faker.internet.email(),
        oldPassword: faker.internet.password(10),
        newPassword: faker.internet.password(10),
        ...request,
    };
};

export { anEditAccountCredentialsRequest };