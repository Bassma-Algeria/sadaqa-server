import { expect } from 'chai';
import { bootstrapNestApp } from '../../src/web/rest/main';
import { aDonationCreationBody } from './base/data/post';
import { aUserRegistrationBody } from './base/data/user';

import { EndPoints } from './base/helpers/Endpoints';
import { HttpRequester } from './base/helpers/HttpRequester';

describe('Walking Skeleton', () => {
  let requester: HttpRequester;

  before(async () => {
    const app = await bootstrapNestApp();
    await app.init();

    requester = new HttpRequester(app.getHttpServer());
  });

  it.skip('user create an account, publish a donation, another user came in and found the post in the donations section, and get more infomation about it', async () => {
    const { accessToken } = await registerRandomUser();
    const { postId } = await postNewDonationByUserWithToken(accessToken);
    const { donations } = await getAllDonations();

    expect(donations).to.have.lengthOf(1);
    expect(donations[0]).to.have.property('postId', postId);

    const { post } = await getDonationWithId(postId);

    expect(post).to.have.property('postId');
    expect(post).to.have.property('title');
    expect(post).to.have.property('wilaya');
    expect(post).to.have.property('description');
  });

  const registerRandomUser = async () => {
    const {
      body: { accessToken },
    } = await requester.post(EndPoints.REGISTER, aUserRegistrationBody());

    return { accessToken };
  };

  const postNewDonationByUserWithToken = async (accessToken: string) => {
    const {
      body: { postId },
    } = await requester.post(EndPoints.NEW_DONATION, aDonationCreationBody(), {
      Authorisation: accessToken,
    });

    return { postId };
  };

  const getAllDonations = async () => {
    const { body: donations } = await requester.get(EndPoints.GET_DONATIONS);

    return { donations };
  };

  const getDonationWithId = async (postId: string) => {
    const { body } = await requester.get(EndPoints.GET_DONATION(postId));

    return { post: body };
  };
});
