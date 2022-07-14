import { expect } from 'chai';

import { aDonationCreationBody } from './base/data/post';
import { aUserRegistrationBody } from './base/data/user';

import { EndPoints } from './base/helpers/Endpoints';
import { HttpRequester } from './base/helpers/HttpRequester';

import { bootstrapNestApp } from '../../src/web/rest/main';

import { prisma } from '../../src/components/_shared_/persistence/prisma/PrismaClient';

describe('Walking Skeleton', () => {
  let requester: HttpRequester;

  before(async () => {
    const app = await bootstrapNestApp();
    await app.init();

    requester = new HttpRequester(app.getHttpServer());
  });

  beforeEach(async () => {
    await prisma.donationPost.deleteMany();
    await prisma.user.deleteMany();
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
    } = await requester.post(EndPoints.REGISTER, aUserRegistrationBody());

    return { accessToken };
  };

  const postNewDonationByUserWithToken = async (accessToken: string) => {
    const body = aDonationCreationBody();

    const {
      body: { postId },
    } = await requester.post(EndPoints.NEW_DONATION, body, {
      Authorisation: accessToken,
    });

    return { postId, category: body.category };
  };

  const getAllDonationsOfCategory = async (category: string) => {
    const {
      body: { donationsPosts },
    } = await requester.get(EndPoints.GET_DONATIONS({ category }));

    return { donationsPosts };
  };

  const getDonationWithId = async (postId: string) => {
    const { body } = await requester.get(EndPoints.GET_DONATION(postId));

    return { post: body };
  };
});
