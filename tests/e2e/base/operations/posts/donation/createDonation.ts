import request from 'supertest';
import { EndPoints } from '../../../Endpoints';
import { faker } from '@faker-js/faker';

const createDonation = async (server: any, accessToken: string) => {
    const {
        body: { postId },
    } = await request(server)
        .post(EndPoints.NEW_DONATION)
        .field(aDonationCreationBody())
        .set('Authorisation', accessToken);

    return { postId };
};

const aDonationCreationBody = () => {
    return {
        title: faker.definitions.title,
        category:
            DONATION_CATEGORIES[
                faker.datatype.number({ min: 0, max: DONATION_CATEGORIES.length - 1 })
            ],
        description: faker.datatype.string(40),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        pictures: [] as any[],
    };
};

const DONATION_CATEGORIES = [
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
] as const;

export { createDonation };