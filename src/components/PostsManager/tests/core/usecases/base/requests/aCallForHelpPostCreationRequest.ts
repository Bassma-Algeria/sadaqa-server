import { faker } from '@faker-js/faker';
import { CreateCallForHelpPostUseCaseRequest } from '../../../../../main/core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';

const aCallForHelpPostCreationRequest = (
  request?: Partial<CreateCallForHelpPostUseCaseRequest>,
): CreateCallForHelpPostUseCaseRequest => ({
  title: faker.datatype.string(8),
  description: faker.datatype.string(30),
  publisherId: faker.datatype.uuid(),
  wilayaNumber: faker.datatype.number({ min: 1, max: 40 }),
  ccp: faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString(),
  ccpKey: faker.datatype.number({ min: 10, max: 99 }).toString(),
  baridiMobNumber: faker.phone.number('00799999############').toString(),
  pictures: Array.from({ length: 4 }).map(() => Buffer.from(faker.image.image())),
  ...request,
});

export { aCallForHelpPostCreationRequest };
