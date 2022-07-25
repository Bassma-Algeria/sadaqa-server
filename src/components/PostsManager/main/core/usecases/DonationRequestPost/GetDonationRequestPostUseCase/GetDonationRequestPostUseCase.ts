import { UseCase } from '../../UseCase';
import { GetDonationRequestPostUseCaseRequest } from './GetDonationRequestPostUseCaseRequest';
import { GetDonationRequestPostUseCaseResponse } from './GetDonationRequestPostUseCaseResponse';

import { PostId } from '../../../domain/PostId';

import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';

import { DonationRequestPostDtoMapper } from '../../_common_/dtos/DonationRequestPostDtoMapper';

class GetDonationRequestPostUseCase
  implements UseCase<GetDonationRequestPostUseCaseRequest, GetDonationRequestPostUseCaseResponse>
{
  constructor(private readonly donationRequestPostRepository: DonationRequestPostRepository) {}

  async handle(
    request: GetDonationRequestPostUseCaseRequest,
  ): Promise<GetDonationRequestPostUseCaseResponse> {
    const postId = new PostId(request.postId);
    const donationPost = await this.donationRequestPostRepository.findById(postId);

    if (!donationPost) throw new PostNotFoundException();

    return DonationRequestPostDtoMapper.toDto(donationPost);
  }
}

export { GetDonationRequestPostUseCase };
