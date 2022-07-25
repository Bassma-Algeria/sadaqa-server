import { UseCase } from '../../UseCase';
import { GetFamilyInNeedPostUseCaseRequest } from './GetFamilyInNeedPostUseCaseRequest';
import { GetFamilyInNeedPostUseCaseResponse } from './GetFamilyInNeedPostUseCaseResponse';

import { PostId } from '../../../domain/PostId';

import { FamilyInNeedPostRepository } from '../../../domain/services/FamilyInNeedPostRepository';

import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';

import { FamilyInNeedPostDtoMapper } from '../../_common_/dtos/FamilyInNeedPostDtoMapper';

class GetFamilyInNeedPostUseCase
  implements UseCase<GetFamilyInNeedPostUseCaseRequest, GetFamilyInNeedPostUseCaseResponse>
{
  constructor(private readonly familyInNeedPostRepository: FamilyInNeedPostRepository) {}

  async handle(
    request: GetFamilyInNeedPostUseCaseRequest,
  ): Promise<GetFamilyInNeedPostUseCaseResponse> {
    const post = await this.familyInNeedPostRepository.findById(new PostId(request.postId));

    if (!post) throw new PostNotFoundException();

    return FamilyInNeedPostDtoMapper.toDto(post);
  }
}

export { GetFamilyInNeedPostUseCase };