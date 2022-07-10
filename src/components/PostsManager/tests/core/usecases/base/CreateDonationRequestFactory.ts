import { faker } from '@faker-js/faker';

import { CreateDonationPostUseCaseRequest } from '../../../../main/core/usecases/CreateDonationPostPostUseCase/CreateDonationPostUseCaseRequest';

const aDonationPostCreationRequest = (
  request?: Partial<CreateDonationPostUseCaseRequest>,
): CreateDonationPostUseCaseRequest => {
  return {
    title: faker.datatype.string(8),
    description: faker.datatype.string(30),
    publisherId: faker.datatype.uuid(),
    wilayaNumber: faker.datatype.number({ min: 1, max: 40 }),
    category: 'food',
    pictures: Array.from({ length: 4 }).map(() => faker.image.abstract()),
    ...request,
  };
};

export { aDonationPostCreationRequest };
