import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../components/PostsManager/main/PostsManagerConfiguration';

import { GetDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { GetDonationsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

@Injectable()
class PostsService {
  private readonly authenticationManager =
    AuthenticationManagerConfiguration.anAuthenticationManagerFacade();
  private readonly postsManager = PostsManagerConfiguration.aPostsManagerFacade();

  getDonationById(request: GetDonationPostUseCaseRequest) {
    return this.postsManager.getDonationPost(request);
  }

  getDonations(request: GetDonationsPostsUseCaseRequest) {
    return this.postsManager.getDonationsPosts(request);
  }

  async createNewDonation(
    accessToken: string,
    body: Exclude<CreateDonationPostUseCaseRequest, 'publisherId'>,
  ) {
    const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.createDonationPost({ ...body, publisherId });
  }
}

export { PostsService };