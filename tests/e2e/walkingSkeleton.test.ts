import { expect } from 'chai';
import { getDonationCreationInfo } from './base/data/post';
import { getUserRegistrationInfo } from './base/data/user';
import { EndPoints } from './base/helpers/Endpoints';

import { HttpRequester } from './base/helpers/HttpRequester';

describe.skip('Walking Skeleton', () => {
  let requester: HttpRequester;

  before(() => {
    requester = new HttpRequester({} as any);
  });

  after(() => {
    requester.close();
  });

  it('user create an account, publish a donation, another user came in and found the post in the donations section, and get more infomation about it', async () => {
    const user = getUserRegistrationInfo();
    const { body: signupResponse } = await requester.post(EndPoints.REGISTER, user);

    const post = getDonationCreationInfo({ type: 'donations' });
    const { body: addPostRes } = await requester.post(EndPoints.PUBLISH_POST, post, {
      Authorisation: signupResponse.token,
    });

    const { body: getDonationsRes } = await requester.get(EndPoints.GET_DONATIONS);
    const { body: postInfo } = await requester.get(EndPoints.GET_POST(addPostRes.postId));

    expect(getDonationsRes.posts).to.have.lengthOf(1);

    expect(postInfo.postId).to.equal(addPostRes.postId);
    expect(postInfo.description).to.equal(post.description);
    expect(postInfo.wilaya).to.equal(post.wilaya);
  });
});
