import { UseCase } from '../UseCase';
import { GetDonationPostUseCaseRequest } from './GetDonationPostUseCaseRequest';
import { GetDonationPostUseCaseResponse } from './GetDonationPostUseCaseResponse';

import { DonationPostDtoMapper } from '../DonationPostDtoMapper';

import { PostId } from '../../domain/PostId';

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

    return DonationPostDtoMapper.toDto(donationPost);
  }
}

export { GetDonationPostUseCase };
