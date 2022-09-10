import { UserId } from '../UserId';
import { PostTokens } from '../PostTokens';

export interface PostsService {
    getPublishersOfDonationsThatMatch(postTokens: PostTokens): Promise<UserId[]>;

    getPublishersOfDonationRequestsThatMatch(postTokens: PostTokens): Promise<UserId[]>;
}