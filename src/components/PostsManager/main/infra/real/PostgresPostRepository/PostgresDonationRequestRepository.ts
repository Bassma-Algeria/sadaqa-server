import { DonationRequestPost } from '../../../core/domain/DonationRequestPost';
import { PostId } from '../../../core/domain/PostId';
import { UserId } from '../../../core/domain/UserId';

import {
    DonationRequestPostRepository,
    DonationRequestPostRepositoryCountFilters,
    DonationRequestPostRepositoryFindManyFilters,
} from '../../../core/domain/services/PostRepository/DonationRequestPostRepository';

import {
    PostRepositorySearchCountFilters,
    PostRepositorySearchFilters,
} from '../../../core/domain/services/PostRepository/base/PostRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    postId: string;
    title: string;
    description: string;
    category: string;
    wilayaNumber: number;
    pictures: string[];
    publisherId: string;
    status: string;
    createdAt: Date;
}

class PostgresDonationRequestPostRepository implements DonationRequestPostRepository {
    async save(post: DonationRequestPost): Promise<void> {
        await prisma.donationRequestPost.create({ data: this.toDBModel(post) });
    }

    async update(post: DonationRequestPost): Promise<void> {
        await prisma.donationRequestPost.update({
            where: { postId: post.state.postId },
            data: this.toDBModel(post),
        });
    }

    async findById(postId: PostId): Promise<DonationRequestPost | undefined> {
        const dbModel = await prisma.donationRequestPost.findUnique({
            where: { postId: postId.value() },
        });

        if (!dbModel) return undefined;
        else return this.toEntity(dbModel);
    }

    async findManyByPublisherId(id: UserId): Promise<DonationRequestPost[]> {
        const posts = await prisma.donationRequestPost.findMany({
            orderBy: { createdAt: 'desc' },
            where: { publisherId: id.value() },
        });

        return posts.map(this.toEntity);
    }

    async findMany(
        filters: DonationRequestPostRepositoryFindManyFilters,
    ): Promise<DonationRequestPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const dbModels = await prisma.donationRequestPost.findMany({
            where: {
                status: filters.status,
                category: filters.category?.value(),
                wilayaNumber: filters.wilayaNumber?.value(),
            },
            orderBy: { createdAt: 'desc' },
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
        });

        return dbModels.map(model => this.toEntity(model));
    }

    async count(filters: DonationRequestPostRepositoryCountFilters): Promise<number> {
        return await prisma.donationRequestPost.count({
            where: {
                wilayaNumber: filters.wilayaNumber?.value(),
                publisherId: filters?.publisherId?.value(),
                category: filters.category?.value(),
                status: filters?.status,
            },
        });
    }

    async delete(post: DonationRequestPost): Promise<void> {
        await prisma.donationRequestPost.delete({ where: { postId: post.state.postId } });
    }

    async search(filters: PostRepositorySearchFilters): Promise<DonationRequestPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.donationRequestPost.findMany({
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
        const total = await prisma.donationRequestPost.count({
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
        await prisma.donationRequestPost.deleteMany();
    }

    private toDBModel(post: DonationRequestPost): DBModel {
        return {
            postId: post.state.postId,
            title: post.state.title,
            description: post.state.description,
            wilayaNumber: post.state.wilayaNumber,
            publisherId: post.state.publisherId,
            pictures: post.state.pictures,
            category: post.state.category,
            status: post.state.status,
            createdAt: post.state.createdAt,
        };
    }

    private toEntity(dbModel: DBModel) {
        return DonationRequestPost.fromState(dbModel);
    }
}

export { PostgresDonationRequestPostRepository };
