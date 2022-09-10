import { faker } from '@faker-js/faker';

import { EditRegularUserAccountInfoUseCaseRequest } from '../../../../../main/core/usecases/EditAccountInfoUseCases/EditRegularUserAccountInfoUseCase/EditRegularUserAccountInfoUseCaseRequest';

const anEditRegularUserInfoRequest = (
    request?: Partial<EditRegularUserAccountInfoUseCaseRequest>,
): EditRegularUserAccountInfoUseCaseRequest => {
    return {
        accountId: faker.datatype.uuid(),
        firstName: faker.lorem.word(5),
        lastName: faker.lorem.word(5),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        phoneNumber: faker.phone.number('06 ## ## ## ##'),
        profilePicture: null,
        ...request,
    };
};

export { anEditRegularUserInfoRequest };
