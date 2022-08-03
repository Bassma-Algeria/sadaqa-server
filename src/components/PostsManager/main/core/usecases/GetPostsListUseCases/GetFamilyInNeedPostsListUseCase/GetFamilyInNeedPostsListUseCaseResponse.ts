import { FamilyInNeedPostDto } from '../../_common_/dtos/FamilyInNeedPostDto';
import { GetPostsListUseCaseResponse } from '../base/GetPostsListUseCaseResponse';

export interface GetFamilyInNeedPostsListUseCaseResponse
    extends GetPostsListUseCaseResponse<FamilyInNeedPostDto> {}
