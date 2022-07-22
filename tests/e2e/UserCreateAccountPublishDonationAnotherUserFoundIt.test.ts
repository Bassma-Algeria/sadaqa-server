import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';

import { EndPoints } from './base/Endpoints';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

describe('User Create Account Publish a DonationPost Another User FoundIt', () => {
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
    const { postId, category } = await postNewDonationByUserWithToken(accessToken);
    const { donations } = await getAllDonationsOfCategory(category);

    const { post } = await getDonationWithId(postId);

    expect(donations).to.have.lengthOf(1);
    expect(donations[0]).to.deep.equal(post);
    expect(donations[0]).to.have.property('postId', postId);
  });

  const registerRandomUser = async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post(EndPoints.REGISTER_USER)
      .send(aUserRegistrationBody());

    return { accessToken };
  };

  const postNewDonationByUserWithToken = async (accessToken: string) => {
    const body: any = aDonationCreationBody();

    const {
      body: { postId },
    } = await request(app.getHttpServer())
      .post(EndPoints.NEW_DONATION)
      .field(body)
      .set('Authorisation', accessToken);

    return { postId, category: body.category };
  };

  const getAllDonationsOfCategory = async (category: string) => {
    const {
      body: { donations },
    } = await request(app.getHttpServer()).get(EndPoints.GET_DONATIONS({ category }));

    return { donations };
  };

  const getDonationWithId = async (postId: string) => {
    const { body } = await request(app.getHttpServer()).get(EndPoints.GET_DONATION(postId));

    return { post: body };
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

  const aDonationCreationBody = () => {
    return {
      title: faker.definitions.title,
      category:
        DONATION_CATEGORIES[faker.datatype.number({ min: 0, max: DONATION_CATEGORIES.length - 1 })],
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
