import { UseCase } from '../../UseCase';
import { GetCallForHelpPostUseCaseRequest } from './GetCallForHelpPostUseCaseRequest';
import { GetCallForHelpPostUseCaseResponse } from './GetCallForHelpPostUseCaseResponse';

import { PostId } from '../../../domain/PostId';
import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';

import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';

import { CallForHelpPostDtoMapper } from '../../_common_/dtos/CallForHelpPostDtoMapper';

class GetCallForHelpPostUseCase
  implements UseCase<GetCallForHelpPostUseCaseRequest, GetCallForHelpPostUseCaseResponse>
{
  constructor(private readonly callForHelpPostRepository: CallForHelpPostRepository) {}

  async handle(
    request: GetCallForHelpPostUseCaseRequest,
  ): Promise<GetCallForHelpPostUseCaseResponse> {
    const post = await this.callForHelpPostRepository.findById(new PostId(request.postId));

    if (!post) throw new PostNotFoundException();

    return CallForHelpPostDtoMapper.toDto(post);
  }
}

export { GetCallForHelpPostUseCase };