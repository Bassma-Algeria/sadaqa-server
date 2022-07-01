import { expect } from 'chai';
import { bootstrapNestApp } from '../../src/web/rest/main';
import { getDonationCreationInfo } from './base/data/post';
import { getUserRegistrationInfo } from './base/data/user';

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
    const user = getUserRegistrationInfo();
    const { body: signupResponse } = await requester.post(EndPoints.REGISTER, user);

    const post = getDonationCreationInfo({ type: 'donations' });
    const { body: addPostRes } = await requester.post(EndPoints.PUBLISH_POST, post, {
      Authorisation: signupResponse.accessToken,
    });

    const { body: getDonationsRes } = await requester.get(EndPoints.GET_DONATIONS);
    const { body: postInfo } = await requester.get(EndPoints.GET_POST(addPostRes.postId));

    expect(getDonationsRes.posts).to.have.lengthOf(1);

    expect(postInfo.postId).to.equal(addPostRes.postId);
    expect(postInfo.description).to.equal(post.description);
    expect(postInfo.wilaya).to.equal(post.wilaya);
  });
});
