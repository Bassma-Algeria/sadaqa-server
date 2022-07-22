import { faker } from '@faker-js/faker';

import { Email } from '../../../main/core/domain/Email';
import { UserId } from '../../../main/core/domain/UserId';
import { Password } from '../../../main/core/domain/Password';
import { PhoneNumber } from '../../../main/core/domain/PhoneNumber';
import { WilayaNumber } from '../../../main/core/domain/WilayaNumber';
import { AssociationName } from '../../../main/core/domain/AssociationName';
import { AssociationAccount } from '../../../main/core/domain/AssociationAccount';

const anAssociationAccount = () => {
  return new AssociationAccount(
    new UserId(faker.datatype.uuid()),
    new AssociationName(faker.lorem.word(7)),
    new PhoneNumber(faker.phone.number('06 ## ## ## ##')),
    new WilayaNumber(faker.datatype.number({ min: 1 })),
    new Email(faker.internet.email()),
    new Password(faker.internet.password(10)),
    faker.datatype.boolean(),
    faker.date.soon(),
  );
};

export { anAssociationAccount };