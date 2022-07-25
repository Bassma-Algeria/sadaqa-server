import { PostId } from '../PostId';
import { WilayaNumber } from '../WilayaNumber';
import { FamilyInNeedPost } from '../FamilyInNeedPost';

export interface FindManyFilters {
  page: number;
  pageLimit: number;
  wilayaNumber?: WilayaNumber;
}

export interface CountFilters {
  wilayaNumber?: WilayaNumber;
}

export interface FamilyInNeedPostRepository {
  save(familyInNeedPost: FamilyInNeedPost): Promise<void>;

  update(familyInNeedPost: FamilyInNeedPost): Promise<void>;

  findById(id: PostId): Promise<FamilyInNeedPost | undefined>;

  findMany(filters: FindManyFilters): Promise<FamilyInNeedPost[]>;

  count(filters?: CountFilters): Promise<number>;
}