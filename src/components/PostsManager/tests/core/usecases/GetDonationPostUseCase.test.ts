import { expect } from 'chai';

import { aPostsManagerFacade } from './base/PostsManagerFacadeFactory';

import { DonationPostNotFoundException } from '../../../main/core/usecases/GetDonationPostUseCase/exceptions/DonationPostNotFoundException';

describe('GetDonationPostUseCase', () => {
  const postsManagerFacade = aPostsManagerFacade();

  it('given a non existing id, should throw a not found exception', async () => {
    const NOT_EXISING_POST = 'some random';

    await expect(
      postsManagerFacade.getDonationPost({ postId: NOT_EXISING_POST }),
    ).to.eventually.be.rejectedWith(DonationPostNotFoundException);
  });
});
