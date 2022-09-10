import { faker } from '@faker-js/faker';

import { RegisterAssociationUseCaseRequest } from '../../../../../main/core/usecases/RegisterUseCases/RegisterAssociationUseCase/RegisterAssociationUseCaseRequest';

const anAssociationRegistrationRequest = (
    request?: Partial<RegisterAssociationUseCaseRequest>,
): RegisterAssociationUseCaseRequest => {
    const password = faker.internet.password(10);

    return {
        associationName: faker.lorem.word(5),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        phoneNumber: faker.phone.number('07 ## ## ## ##'),
        email: faker.internet.email(),
        password,
        confirmPassword: password,
        associationDocs: [{ filename: faker.system.fileName(), buffer: Buffer.alloc(10) }],
        ...request,
    };
};

export { anAssociationRegistrationRequest };
