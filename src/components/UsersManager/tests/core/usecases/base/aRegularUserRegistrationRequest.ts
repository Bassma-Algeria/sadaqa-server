import { faker } from '@faker-js/faker';

import { RegisterRegularUserUseCaseRequest } from '../../../../main/core/usecases/RegisterRegularUserUseCase/RegisterRegularUserUseCaseRequest';

const aRegularUserRegistrationRequest = (
  info?: Partial<RegisterRegularUserUseCaseRequest>,
): RegisterRegularUserUseCaseRequest => {
  const password = faker.internet.password(10);

  return {
    firstName: faker.lorem.word(5),
    lastName: faker.lorem.word(5),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    phoneNumber: faker.phone.number('06 ## ## ## ##'),
    email: faker.internet.email(),
    password,
    confirmPassword: password,
    ...info,
  };
};

export { aRegularUserRegistrationRequest };
