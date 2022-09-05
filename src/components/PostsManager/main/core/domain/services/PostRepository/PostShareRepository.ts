import { PostShare } from '../../PostShare';

export interface PostShareRepository {
    save(share: PostShare): Promise<void>;

    findMany(): Promise<PostShare[]>;
}
