import { FamilyInNeedPostDto } from '../../_common_/dtos/FamilyInNeedPostDto';

export interface GetFamiliesInNeedPostsUseCaseResponse {
  readonly total: number;
  readonly page: number;
  readonly end: boolean;
  readonly familiesInNeed: FamilyInNeedPostDto[];
}
