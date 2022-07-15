import { expect } from 'chai';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { aDonationCreationBody } from './base/data/post';

import { EndPoints } from './base/helpers/Endpoints';

import { AppModule } from '../../src/web/rest/app.module';

import { prisma } from '../../src/components/_shared_/persistence/prisma/PrismaClient';
import { aUserRegistrationBody } from './base/data/user';

describe('Walking Skeleton', () => {
  let app: INestApplication;

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await prisma.donationPost.deleteMany();
    await prisma.user.deleteMany();
  });

  after(async () => {
    await app.close();
  });

  it('user create an account, publish a donation, another user came in and found the post in the donations section, and get more infomation about it', async () => {
    const { accessToken } = await registerRandomUser();
    const { postId, category } = await postNewDonationByUserWithToken(accessToken);
    const { donationsPosts } = await getAllDonationsOfCategory(category);

    expect(donationsPosts).to.have.lengthOf(1);
    expect(donationsPosts[0]).to.have.property('postId', postId);

    const { post } = await getDonationWithId(postId);

    expect(post).to.have.property('postId');
    expect(post).to.have.property('title');
    expect(post).to.have.property('wilayaNumber');
    expect(post).to.have.property('description');
  });

  const registerRandomUser = async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer()).post(EndPoints.REGISTER).send(aUserRegistrationBody());

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
      body: { donationsPosts },
    } = await request(app.getHttpServer()).get(EndPoints.GET_DONATIONS({ category }));

    return { donationsPosts };
  };

  const getDonationWithId = async (postId: string) => {
    const { body } = await request(app.getHttpServer()).get(EndPoints.GET_DONATION(postId));

    return { post: body };
  };
});
