import { faker } from '@faker-js/faker';
import { UpdateDonationRequestPostUseCaseRequest } from '../../../../../main/core/usecases/UpdatePostUseCases/UpdateDonationRequestPostUseCase/UpdateDonationRequestPostUseCaseRequest';

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

const anEditDonationRequestPostRequest = (
    request?: Partial<UpdateDonationRequestPostUseCaseRequest>,
): UpdateDonationRequestPostUseCaseRequest => ({
    postId: faker.datatype.uuid(),
    userId: faker.datatype.uuid(),
    title: faker.datatype.string(8),
    description: faker.datatype.string(30),
    wilayaNumber: faker.datatype.number({ min: 1, max: 40 }),
    category: CATEGORIES[faker.datatype.number({ min: 0, max: CATEGORIES.length - 1 })],
    pictures: {
        old: [],
        new: Array.from({ length: 4 }).map(() => Buffer.from(faker.image.image())),
    },
    ...request,
});

export { anEditDonationRequestPostRequest };
