import { faker } from '@faker-js/faker';

import { CreateDonationPostUseCaseRequest } from '../../../../main/core/usecases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';

const CATEGORIES = [
  'clothes-accessories',
  'food',
  'services',
  'electronics-appliances',
  'home-furnitures',
  'books-magazines',
  'sports',
  'cosmetics-hygiene',
  'animales-accessories',
  'toys',
  'tools',
  'health-medicines',
  'cars-accessories',
  'others',
];

const aDonationPostCreationRequest = (
  request?: Partial<CreateDonationPostUseCaseRequest>,
): CreateDonationPostUseCaseRequest => {
  return {
    title: faker.datatype.string(8),
    description: faker.datatype.string(30),
    publisherId: faker.datatype.uuid(),
    wilayaNumber: faker.datatype.number({ min: 1, max: 40 }),
    category: CATEGORIES[faker.datatype.number({ min: 0, max: CATEGORIES.length - 1 })],
    pictures: Array.from({ length: 4 }).map(() => Buffer.from(faker.image.image())),
    ...request,
  };
};

export { aDonationPostCreationRequest };
