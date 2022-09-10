import { PostId } from '../../../core/domain/PostId';
import { UserId } from '../../../core/domain/UserId';

import { FamilyInNeedPost } from '../../../core/domain/FamilyInNeedPost';

import {
    PostRepositoryCountFilters,
    PostRepositoryFindManyFilters,
    PostRepositorySearchCountFilters,
    PostRepositorySearchFilters,
} from '../../../core/domain/services/PostRepository/base/PostRepository';
import { FamilyInNeedPostRepository } from '../../../core/domain/services/PostRepository/FamilyInNeedPostRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    postId: string;
    title: string;
    description: string;
    wilayaNumber: number;
    publisherId: string;
    pictures: string[];
    ccp: string | null;
    ccpKey: string | null;
    baridiMobNumber: string | null;
    status: string;
    createdAt: Date;
}

class PostgresFamilyInNeedPostRepository implements FamilyInNeedPostRepository {
    async findById(id: PostId): Promise<FamilyInNeedPost | undefined> {
        const post = await prisma.familyInNeedPost.findUnique({ where: { postId: id.value() } });

        if (!post) return undefined;
        return this.toEntity(post);
    }

    async save(familyInNeedPost: FamilyInNeedPost): Promise<void> {
        await prisma.familyInNeedPost.create({ data: this.toDBModel(familyInNeedPost) });
    }

    async update(post: FamilyInNeedPost): Promise<void> {
        await prisma.familyInNeedPost.update({
            where: { postId: post.state.postId },
            data: this.toDBModel(post),
        });
    }

    async findManyByPublisherId(id: UserId): Promise<FamilyInNeedPost[]> {
        const posts = await prisma.familyInNeedPost.findMany({
            orderBy: { createdAt: 'desc' },
            where: { publisherId: id.value() },
        });

        return posts.map(this.toEntity);
    }

    async findMany(filters: PostRepositoryFindManyFilters): Promise<FamilyInNeedPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.familyInNeedPost.findMany({
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
        return await prisma.familyInNeedPost.count({
            where: {
                wilayaNumber: filters?.wilayaNumber?.value(),
                publisherId: filters?.publisherId?.value(),
                status: filters?.status,
            },
        });
    }

    async delete(post: FamilyInNeedPost): Promise<void> {
        await prisma.familyInNeedPost.delete({ where: { postId: post.state.postId } });
    }

    async search(filters: PostRepositorySearchFilters): Promise<FamilyInNeedPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.familyInNeedPost.findMany({
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
        const total = await prisma.familyInNeedPost.count({
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
        await prisma.familyInNeedPost.deleteMany();
    }

    private toEntity(model: DBModel): FamilyInNeedPost {
        return FamilyInNeedPost.fromState({
            ...model,
            ccp: model.ccp ? { number: model.ccp, key: model.ccpKey! } : null,
        });
    }

    private toDBModel(post: FamilyInNeedPost): DBModel {
        return {
            postId: post.state.postId,
            title: post.state.title,
            description: post.state.description,
            wilayaNumber: post.state.wilayaNumber,
            publisherId: post.state.publisherId,
            pictures: post.state.pictures,
            status: post.state.status,
            createdAt: post.state.createdAt,
            ccp: post.state.ccp ? post.state.ccp.number : null,
            ccpKey: post.state.ccp ? post.state.ccp.key : null,
            baridiMobNumber: post.state.baridiMobNumber ? post.state.baridiMobNumber : null,
        };
    }
}

export { PostgresFamilyInNeedPostRepository };
