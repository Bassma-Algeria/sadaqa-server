import { UseCase } from '../../UseCase';
import { GetDonationPostUseCaseRequest } from './GetDonationPostUseCaseRequest';
import { GetDonationPostUseCaseResponse } from './GetDonationPostUseCaseResponse';

import { DonationPostDtoMapper } from '../../_common_/dtos/DonationPostDtoMapper';

import { PostId } from '../../../domain/PostId';

import { DonationPostRepository } from '../../../domain/services/DonationPostRepository';

import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';

class GetDonationPostUseCase
  implements UseCase<GetDonationPostUseCaseRequest, GetDonationPostUseCaseResponse>
{
  constructor(private readonly donationPostRepository: DonationPostRepository) {}

  async handle(request: GetDonationPostUseCaseRequest): Promise<GetDonationPostUseCaseResponse> {
    const postId = new PostId(request.postId);
    const donationPost = await this.donationPostRepository.findById(postId);

    if (!donationPost) throw new PostNotFoundException();

    return DonationPostDtoMapper.toDto(donationPost);
  }
}

export { GetDonationPostUseCase };
