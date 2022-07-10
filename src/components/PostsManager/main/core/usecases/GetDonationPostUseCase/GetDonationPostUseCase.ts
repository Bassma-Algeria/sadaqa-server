import { UseCase } from '../UseCase';
import { GetDonationPostUseCaseRequest } from './GetDonationPostUseCaseRequest';
import { GetDonationPostUseCaseResponse } from './GetDonationPostUseCaseResponse';

import { PostId } from '../../domain/PostId';
import { DonationPost } from '../../domain/DonationPost';

import { DonationPostRepository } from '../../domain/services/DonationPostRepository';

import { DonationPostNotFoundException } from './exceptions/DonationPostNotFoundException';

class GetDonationPostUseCase
  implements UseCase<GetDonationPostUseCaseRequest, GetDonationPostUseCaseResponse>
{
  constructor(private readonly donationPostRepository: DonationPostRepository) {}

  async handle(request: GetDonationPostUseCaseRequest): Promise<GetDonationPostUseCaseResponse> {
    const postId = new PostId(request.postId);
    const donationPost = await this.donationPostRepository.findById(postId);

    if (!donationPost) throw new DonationPostNotFoundException();

    return this.getResponse(donationPost);
  }

  private getResponse(donationPost: DonationPost): GetDonationPostUseCaseResponse {
    return {
      title: donationPost.title.value(),
      postId: donationPost.postId.value(),
      category: donationPost.category.value(),
      description: donationPost.description.value(),
      publisherId: donationPost.publisherId.value(),
      createdAt: donationPost.createdAt.toISOString(),
      wilayaNumber: donationPost.wilayaNumber.value(),
      pictures: donationPost.pictures.map(pic => pic.value()),
    };
  }
}

export { GetDonationPostUseCase };
