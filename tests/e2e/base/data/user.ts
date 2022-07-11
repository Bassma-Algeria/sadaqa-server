import { faker } from '@faker-js/faker';

interface UserRegistrationBody {
  firstName: string;
  lastName: string;
  wilayaNumber: number;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const aUserRegistrationBody = (info?: Partial<UserRegistrationBody>): UserRegistrationBody => {
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

export { aUserRegistrationBody };
