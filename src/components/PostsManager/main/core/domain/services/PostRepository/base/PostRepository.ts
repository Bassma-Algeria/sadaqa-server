import { Post } from '../../../Post';
import { PostId } from '../../../PostId';
import { UserId } from '../../../UserId';
import { WilayaNumber } from '../../../WilayaNumber';

export interface PostRepositoryFindManyFilters {
    page: number;
    pageLimit: number;
    wilayaNumber?: WilayaNumber;
}

export interface PostRepositoryCountFilters {
    wilayaNumber?: WilayaNumber;
}

export interface PostRepositorySearchFilters extends PostRepositoryFindManyFilters {
    keyword: string;
}

export interface PostRepositorySearchCountFilters extends PostRepositoryCountFilters {
    keyword: string;
}

export interface PostRepository<P extends Post> {
    save(post: P): Promise<void>;

    update(post: P): Promise<void>;

    delete(post: P): Promise<void>;

    findById(id: PostId): Promise<P | undefined>;

    findManyByPublisherId(id: UserId): Promise<P[]>;

    findMany(filters: PostRepositoryFindManyFilters): Promise<P[]>;

    count(filters?: PostRepositoryCountFilters): Promise<number>;

    search(filters: PostRepositorySearchFilters): Promise<P[]>;

    searchCount(filters: PostRepositorySearchCountFilters): Promise<number>;
}
