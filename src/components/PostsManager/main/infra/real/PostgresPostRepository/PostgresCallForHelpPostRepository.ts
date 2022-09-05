import { PostId } from '../../../core/domain/PostId';
import { UserId } from '../../../core/domain/UserId';
import { CallForHelpPost } from '../../../core/domain/CallForHelpPost';

import {
    PostRepositoryCountFilters,
    PostRepositoryFindManyFilters,
    PostRepositorySearchCountFilters,
    PostRepositorySearchFilters,
} from '../../../core/domain/services/PostRepository/base/PostRepository';

import { CallForHelpPostRepository } from '../../../core/domain/services/PostRepository/CallForHelpPostRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    postId: string;
    title: string;
    description: string;
    wilayaNumber: number;
    publisherId: string;
    pictures: string[];
    status: string;
    ccp: string | null;
    ccpKey: string | null;
    baridiMobNumber: string | null;
    createdAt: Date;
}

class PostgresCallForHelpPostRepository implements CallForHelpPostRepository {
    async findById(id: PostId): Promise<CallForHelpPost | undefined> {
        const post = await prisma.callForHelpPost.findUnique({ where: { postId: id.value() } });

        if (!post) return undefined;
        return this.toEntity(post);
    }

    async save(post: CallForHelpPost): Promise<void> {
        await prisma.callForHelpPost.create({ data: this.toDBModel(post) });
    }

    async update(post: CallForHelpPost): Promise<void> {
        await prisma.callForHelpPost.update({
            data: this.toDBModel(post),
            where: {
                postId: post.state.postId,
            },
        });
    }

    async findManyByPublisherId(id: UserId): Promise<CallForHelpPost[]> {
        const posts = await prisma.callForHelpPost.findMany({
            orderBy: { createdAt: 'desc' },
            where: { publisherId: id.value() },
        });

        return posts.map(this.toEntity);
    }

    async findMany(filters: PostRepositoryFindManyFilters): Promise<CallForHelpPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.callForHelpPost.findMany({
            where: {
                status: filters.status,
                wilayaNumber: filters.wilayaNumber?.value(),
            },
            orderBy: { createdAt: 'desc' },
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
        });

        return posts.map(post => this.toEntity(post));
    }

    async count(filters?: PostRepositoryCountFilters): Promise<number> {
        return await prisma.callForHelpPost.count({
            where: {
                wilayaNumber: filters?.wilayaNumber?.value(),
                publisherId: filters?.publisherId?.value(),
                status: filters?.status,
            },
        });
    }

    async delete(post: CallForHelpPost): Promise<void> {
        await prisma.callForHelpPost.delete({ where: { postId: post.state.postId } });
    }

    async search(filters: PostRepositorySearchFilters): Promise<CallForHelpPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.callForHelpPost.findMany({
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
            where: {
                status: filters.status,
                wilayaNumber: filters.wilayaNumber?.value(),
                OR: [
                    { title: { contains: filters.keyword } },
                    { description: { contains: filters.keyword } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return posts.map(post => this.toEntity(post));
    }

    async searchCount(filters: PostRepositorySearchCountFilters): Promise<number> {
        const total = await prisma.callForHelpPost.count({
            where: {
                wilayaNumber: filters.wilayaNumber?.value(),
                OR: [
                    { title: { contains: filters.keyword } },
                    { description: { contains: filters.keyword } },
                ],
            },
        });

        return total;
    }

    async deleteAll() {
        await prisma.callForHelpPost.deleteMany();
    }

    private toEntity(model: DBModel): CallForHelpPost {
        return CallForHelpPost.fromState({
            ...model,
            ccp: model.ccp ? { number: model.ccp, key: model.ccpKey! } : null,
        });
    }

    private toDBModel(post: CallForHelpPost): DBModel {
        return {
            postId: post.state.postId,
            title: post.state.title,
            description: post.state.description,
            wilayaNumber: post.state.wilayaNumber,
            publisherId: post.state.publisherId,
            pictures: post.state.pictures,
            status: post.state.status.toString(),
            createdAt: post.state.createdAt,
            ccp: post.state.ccp ? post.state.ccp.number : null,
            ccpKey: post.state.ccp ? post.state.ccp.key : null,
            baridiMobNumber: post.state.baridiMobNumber ? post.state.baridiMobNumber : null,
        };
    }
}

export { PostgresCallForHelpPostRepository };
