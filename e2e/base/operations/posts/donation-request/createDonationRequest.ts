import request from 'supertest';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../../Endpoints';

const createDonationRequest = async (
    server: any,
    accessToken: string,
    values?: Record<string, any>,
) => {
    const donationRequestInfo = { ...aDonationRequestCreationBody(), ...values };

    const {
        body: { postId },
    } = await request(server)
        .post(EndPoints.NEW_DONATION_REQUEST)
        .field(donationRequestInfo)
        .set('Authorization', accessToken);

    return { postId, donationRequestInfo };
};

const aDonationRequestCreationBody = () => {
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
] as const;

export { createDonationRequest };
