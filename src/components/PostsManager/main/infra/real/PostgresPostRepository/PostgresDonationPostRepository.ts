import { PostId } from '../../../core/domain/PostId';
import { DonationPost } from '../../../core/domain/DonationPost';
import { UserId } from '../../../core/domain/UserId';

import {
    DonationPostRepository,
    DonationPostRepositoryCountFilters,
    DonationPostRepositoryFindManyFilters,
} from '../../../core/domain/services/PostRepository/DonationPostRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';
import {
    PostRepositorySearchCountFilters,
    PostRepositorySearchFilters,
} from '../../../core/domain/services/PostRepository/base/PostRepository';

interface DonationPostDBModel {
    postId: string;
    title: string;
    description: string;
    category: string;
    wilayaNumber: number;
    pictures: string[];
    status: string;
    publisherId: string;
    createdAt: Date;
}

class PostgresDonationPostRepository implements DonationPostRepository {
    async save(donationPost: DonationPost): Promise<void> {
        await prisma.donationPost.create({ data: this.toDBModel(donationPost) });
    }

    async update(donationPost: DonationPost): Promise<void> {
        await prisma.donationPost.update({
            data: this.toDBModel(donationPost),
            where: { postId: donationPost.state.postId },
        });
    }

    async findById(postId: PostId): Promise<DonationPost | undefined> {
        const dbModel = await prisma.donationPost.findUnique({ where: { postId: postId.value() } });

        if (!dbModel) return undefined;
        else return this.toEntity(dbModel);
    }

    async findManyByPublisherId(id: UserId): Promise<DonationPost[]> {
        const posts = await prisma.donationPost.findMany({
            orderBy: { createdAt: 'desc' },
            where: { publisherId: id.value() },
        });

        return posts.map(this.toEntity);
    }

    async findMany(filters: DonationPostRepositoryFindManyFilters): Promise<DonationPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const dbModels = await prisma.donationPost.findMany({
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

    async count(filters: DonationPostRepositoryCountFilters): Promise<number> {
        return await prisma.donationPost.count({
            where: {
                category: filters.category?.value(),
                publisherId: filters?.publisherId?.value(),
                wilayaNumber: filters.wilayaNumber?.value(),
                status: filters?.status,
            },
        });
    }

    async delete(post: DonationPost): Promise<void> {
        await prisma.donationPost.delete({ where: { postId: post.state.postId } });
    }

    async search(filters: PostRepositorySearchFilters): Promise<DonationPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.donationPost.findMany({
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
        const total = await prisma.donationPost.count({
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
        await prisma.donationPost.deleteMany();
    }

    private toDBModel(post: DonationPost): DonationPostDBModel {
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

    private toEntity(dbModel: DonationPostDBModel) {
        return DonationPost.fromState(dbModel);
    }
}

export { PostgresDonationPostRepository };
