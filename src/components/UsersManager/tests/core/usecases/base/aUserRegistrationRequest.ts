import { faker } from '@faker-js/faker';

import { RegisterUserUseCaseRequest } from '../../../../main/core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

const aUserRegistrationRequest = (
  info?: Partial<RegisterUserUseCaseRequest>,
): RegisterUserUseCaseRequest => {
  const password = faker.internet.password(10);

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    phoneNumber: faker.phone.number('06 ## ## ## ##'),
    email: faker.internet.email(),
    password,
    confirmPassword: password,
    ...info,
  };
};

export { aUserRegistrationRequest };
