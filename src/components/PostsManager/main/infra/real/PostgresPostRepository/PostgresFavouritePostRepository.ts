import { UserId } from '../../../core/domain/UserId';
import { PostId } from '../../../core/domain/PostId';
import { PostType } from '../../../core/domain/PostType';
import { FavouritePost } from '../../../core/domain/FavouritePost';
import { FavouritePostBuilder } from '../../../core/domain/FavouritePostBuilder';

import { FavouritePostRepository } from '../../../core/domain/services/PostRepository/FavouritePostRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    userId: string;
    postId: string;
    postType: string;
}

class PostgresFavouritePostRepository implements FavouritePostRepository {
    async save(favouritePost: FavouritePost): Promise<void> {
        await prisma.favouritePost.create({ data: this.toDBModel(favouritePost) });
    }

    async findByUserId(userId: UserId): Promise<FavouritePost[]> {
        const posts = await prisma.favouritePost.findMany({ where: { userId: userId.value() } });

        return posts.map(post => this.toEntity(post));
    }

    async delete(post: FavouritePost): Promise<void> {
        await prisma.favouritePost.delete({
            where: {
                userId_postId_postType: {
                    userId: post.userId.value(),
                    postId: post.postId.value(),
                    postType: post.postType.value(),
                },
            },
        });
    }

    async deleteMany(args: { postId: PostId; postType: PostType }): Promise<void> {
        await prisma.favouritePost.deleteMany({
            where: {
                postId: args.postId.value(),
                postType: args.postType.value(),
            },
        });
    }

    private toEntity(model: DBModel) {
        return FavouritePostBuilder.aBuilder()
            .withPostType(new PostType(model.postType))
            .withPostId(new PostId(model.postId))
            .withUserId(new UserId(model.userId))
            .build();
    }

    private toDBModel(post: FavouritePost): DBModel {
        return {
            userId: post.userId.value(),
            postId: post.postId.value(),
            postType: post.postType.value(),
        };
    }
}

export { PostgresFavouritePostRepository };
