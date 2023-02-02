import { faker } from '@faker-js/faker';

import { UpdateDonationPostUseCaseRequest } from '../../../../../main/core/usecases/UpdatePostUseCases/UpdateDonationPostUseCase/UpdateDonationPostUseCaseRequest';

const CATEGORIES = [
    'clothes-accessories',
    'food',
    'repositories',
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

const anEditDonationPostRequest = (
    request?: Partial<UpdateDonationPostUseCaseRequest>,
): UpdateDonationPostUseCaseRequest => ({
    postId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    title: faker.datatype.string(8),
    description: faker.datatype.string(30),
    wilayaNumber: faker.datatype.number({ min: 1, max: 40 }),
    category: CATEGORIES[faker.datatype.number({ min: 0, max: CATEGORIES.length - 1 })],
    pictures: {
        old: [],
        new: Array.from({ length: 4 }).map(() => ({
            buffer: Buffer.from(faker.datatype.string(40)),
            filename: faker.system.fileName(),
        })),
    },
    ...request,
});

export { anEditDonationPostRequest };
