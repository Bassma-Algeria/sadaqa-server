import { FavouritePost } from '../../FavouritePost';

export interface FavouritePostEventPublisher {
    publishPostAddedToFavourite(post: FavouritePost): void;

    publishPostDeletedFromFavourite(post: FavouritePost): void;
}
