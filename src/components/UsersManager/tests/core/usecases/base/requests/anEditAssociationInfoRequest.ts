import { faker } from '@faker-js/faker';

import { EditAssociationAccountInfoUseCaseRequest } from '../../../../../main/core/usecases/EditAccountInfoUseCases/EditAssociationAccountInfoUseCase/EditAssociationAccountInfoUseCaseRequest';

const anEditAssociationInfoRequest = (
    request?: Partial<EditAssociationAccountInfoUseCaseRequest>,
): EditAssociationAccountInfoUseCaseRequest => {
    return {
        accountId: faker.datatype.uuid(),
        associationName: faker.lorem.word(3),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        phoneNumber: faker.phone.number('06 ## ## ## ##'),
        profilePicture: null,
        ...request,
    };
};

export { anEditAssociationInfoRequest };
