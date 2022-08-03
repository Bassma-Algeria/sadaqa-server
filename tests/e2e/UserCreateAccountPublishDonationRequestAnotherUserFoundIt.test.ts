import { INestApplication } from '@nestjs/common';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';
import { expect } from 'chai';
import request from 'supertest';
import { EndPoints } from './base/Endpoints';
import { faker } from '@faker-js/faker';

describe('User Create an Account and Publish a Donation Request Another User Found It', () => {
    let app: INestApplication;

    before(async () => {
        app = await startNestTestingApp();
    });

    beforeEach(async () => {
        await cleanupDB();
    });

    after(async () => {
        await app.close();
    });

    it('should pass with no problem', async () => {
        const { accessToken } = await registerRandomUser();
        const { postId } = await publishDonationRequestByUserWithToken(accessToken);

        const { list } = await getAllDonationRequests();
        const { donationRequest } = await getDonationRequestWithId(postId);

        expect(list).to.have.lengthOf(1);
        expect(donationRequest).to.deep.equal(list[0]);
        expect(list[0]).to.have.property('postId', postId);
    });

    const registerRandomUser = async () => {
        const {
            body: { accessToken },
        } = await request(app.getHttpServer())
            .post(EndPoints.REGISTER_USER)
            .send(aUserRegistrationBody());

        return { accessToken };
    };

    const publishDonationRequestByUserWithToken = async (accessToken: string) => {
        const {
            body: { postId },
        } = await request(app.getHttpServer())
            .post(EndPoints.NEW_DONATION_REQUEST)
            .field(aDonationRequestCreationBody())
            .set('Authorisation', accessToken);

        return { postId };
    };

    const getAllDonationRequests = async () => {
        const {
            body: { list },
        } = await request(app.getHttpServer()).get(EndPoints.GET_DONATION_REQUESTS);

        return { list };
    };

    const getDonationRequestWithId = async (postId: string) => {
        const { body } = await request(app.getHttpServer()).get(
            EndPoints.GET_DONATION_REQUEST(postId),
        );

        return { donationRequest: body };
    };

    const aUserRegistrationBody = () => {
        const password = faker.internet.password(10);

        return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
            phoneNumber: faker.phone.number('06 ## ## ## ##'),
            email: faker.internet.email(),
            password,
            confirmPassword: password,
        };
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
});
