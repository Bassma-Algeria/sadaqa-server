import { faker } from '@faker-js/faker';
import { RegularUserAccount } from '../../../main/core/domain/RegularUserAccount';
import { UserId } from '../../../main/core/domain/UserId';
import { FirstName } from '../../../main/core/domain/FirstName';
import { LastName } from '../../../main/core/domain/LastName';
import { WilayaNumber } from '../../../main/core/domain/WilayaNumber';
import { PhoneNumber } from '../../../main/core/domain/PhoneNumber';
import { Email } from '../../../main/core/domain/Email';
import { Password } from '../../../main/core/domain/Password';

const aRegularUserAccount = () => {
  const ALGERIAN_PHONE = faker.phone.number('05 ## ## ## ##');

  return new RegularUserAccount(
    new UserId(faker.datatype.uuid()),
    new FirstName(faker.name.firstName()),
    new LastName(faker.name.lastName()),
    new WilayaNumber(faker.datatype.number({ min: 1, max: 20 })),
    new PhoneNumber(ALGERIAN_PHONE),
    new Email(faker.internet.email()),
    new Password(faker.internet.password()),
    new Date(faker.date.past()),
  );
};

export { aRegularUserAccount };