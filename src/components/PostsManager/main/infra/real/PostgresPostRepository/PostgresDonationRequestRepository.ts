import { DonationRequestPost } from '../../../core/domain/DonationRequestPost';

import { Title } from '../../../core/domain/Title';
import { PostId } from '../../../core/domain/PostId';
import { UserId } from '../../../core/domain/UserId';
import { Picture } from '../../../core/domain/Picture';
import { PostStatus } from '../../../core/domain/PostStatus';
import { Description } from '../../../core/domain/Description';
import { WilayaNumber } from '../../../core/domain/WilayaNumber';
import { DonationCategory } from '../../../core/domain/DonationCategory';

import { DonationRequestPostRepository } from '../../../core/domain/services/PostRepository/DonationRequestPostRepository';

import {
    PostRepositoryCountFilters,
    PostRepositoryFindManyFilters,
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
            where: { postId: post.postId.value() },
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

    async findMany(filters: PostRepositoryFindManyFilters): Promise<DonationRequestPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const dbModels = await prisma.donationRequestPost.findMany({
            where: { wilayaNumber: filters.wilayaNumber?.value() },
            orderBy: { createdAt: 'desc' },
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
        });

        return dbModels.map(model => this.toEntity(model));
    }

    async count(filters: PostRepositoryCountFilters): Promise<number> {
        const total = await prisma.donationRequestPost.count({
            where: {
                wilayaNumber: filters.wilayaNumber?.value(),
            },
        });

        return total;
    }

    async delete(post: DonationRequestPost): Promise<void> {
        await prisma.donationRequestPost.delete({ where: { postId: post.postId.value() } });
    }

    async search(filters: PostRepositorySearchFilters): Promise<DonationRequestPost[]> {
        const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

        const posts = await prisma.donationRequestPost.findMany({
            skip: numOfPostsToSkip,
            take: filters.pageLimit,
            where: {
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
            postId: post.postId.value(),
            title: post.title.value(),
            description: post.description.value(),
            category: post.category.value(),
            wilayaNumber: post.wilayaNumber.value(),
            pictures: post.pictures.map(pic => pic.url()),
            publisherId: post.publisherId.value(),
            status: post.status,
            createdAt: post.createdAt,
        };
    }

    private toEntity(dbModel: DBModel) {
        return DonationRequestPost.aBuilder()
            .withPostId(new PostId(dbModel.postId))
            .withTitle(new Title(dbModel.title))
            .withDescription(new Description(dbModel.description))
            .withCategory(new DonationCategory(dbModel.category))
            .withWilayaNumber(new WilayaNumber(dbModel.wilayaNumber))
            .withPictures(dbModel.pictures.map(url => new Picture(url)))
            .withPublisherId(new UserId(dbModel.publisherId))
            .withCreatedAt(dbModel.createdAt)
            .withStatus(dbModel.status as PostStatus)
            .build();
    }
}

export { PostgresDonationRequestPostRepository };
