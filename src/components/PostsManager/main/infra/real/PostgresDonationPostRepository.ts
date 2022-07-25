import { PostId } from '../../core/domain/PostId';
import { DonationPost } from '../../core/domain/DonationPost';

import { Title } from '../../core/domain/Title';
import { Picture } from '../../core/domain/Picture';
import { Description } from '../../core/domain/Description';
import { UserId } from '../../core/domain/UserId';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { DonationCategory } from '../../core/domain/DonationCategory';

import {
  CountFilters,
  DonationPostRepository,
  FindManyFilters,
} from '../../core/domain/services/DonationPostRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DonationPostDBModel {
  postId: string;
  title: string;
  description: string;
  category: string;
  wilayaNumber: number;
  pictures: string[];
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
      where: { postId: donationPost.postId.value() },
    });
  }

  async findById(postId: PostId): Promise<DonationPost | undefined> {
    const dbModel = await prisma.donationPost.findUnique({ where: { postId: postId.value() } });

    if (!dbModel) return undefined;
    else return this.toEntity(dbModel);
  }

  async findMany(filters: FindManyFilters): Promise<DonationPost[]> {
    const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

    const dbModels = await prisma.donationPost.findMany({
      where: { category: filters.category.value(), wilayaNumber: filters.wilayaNumber?.value() },
      orderBy: { createdAt: 'desc' },
      skip: numOfPostsToSkip,
      take: filters.pageLimit,
    });

    return dbModels.map(model => this.toEntity(model));
  }

  async count(filters: CountFilters): Promise<number> {
    const total = await prisma.donationPost.count({
      where: {
        category: filters.category.value(),
        wilayaNumber: filters.wilayaNumber?.value(),
      },
    });

    return total;
  }

  async deleteAll() {
    await prisma.donationPost.deleteMany();
  }

  private toDBModel(donationPost: DonationPost): DonationPostDBModel {
    return {
      postId: donationPost.postId.value(),
      title: donationPost.title.value(),
      description: donationPost.description.value(),
      category: donationPost.category.value(),
      wilayaNumber: donationPost.wilayaNumber.value(),
      pictures: donationPost.pictures.map(pic => pic.url()),
      publisherId: donationPost.publisherId.value(),
      createdAt: donationPost.createdAt,
    };
  }

  private toEntity(dbModel: DonationPostDBModel) {
    return DonationPost.aBuilder()
      .withPostId(new PostId(dbModel.postId))
      .withTitle(new Title(dbModel.title))
      .withDescription(new Description(dbModel.description))
      .withCategory(new DonationCategory(dbModel.category))
      .withWilayaNumber(new WilayaNumber(dbModel.wilayaNumber))
      .withPictures(dbModel.pictures.map(url => new Picture(url)))
      .withPublisherId(new UserId(dbModel.publisherId))
      .withCreatedAt(dbModel.createdAt)
      .build();
  }
}

export { PostgresDonationPostRepository };
