import { DonationRequestPost } from '../../core/domain/DonationRequestPost';

import { Title } from '../../core/domain/Title';
import { PostId } from '../../core/domain/PostId';
import { Picture } from '../../core/domain/Picture';
import { Description } from '../../core/domain/Description';
import { PublisherId } from '../../core/domain/PublisherId';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { DonationCategory } from '../../core/domain/DonationCategory';

import {
  CountFilters,
  DonationRequestPostRepository,
  FindManyFilters,
} from '../../core/domain/services/DonationRequestPostRepository';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
  postId: string;
  title: string;
  description: string;
  category: string;
  wilayaNumber: number;
  pictures: string[];
  publisherId: string;
  createdAt: Date;
}

class PostgresDonationRequestPostRepository implements DonationRequestPostRepository {
  async save(donationPost: DonationRequestPost): Promise<void> {
    await prisma.donationRequestPost.create({ data: this.toDBModel(donationPost) });
  }

  async findById(postId: PostId): Promise<DonationRequestPost | undefined> {
    const dbModel = await prisma.donationRequestPost.findUnique({
      where: { postId: postId.value() },
    });

    if (!dbModel) return undefined;
    else return this.toEntity(dbModel);
  }

  async findMany(filters: FindManyFilters): Promise<DonationRequestPost[]> {
    const numOfPostsToSkip = (filters.page - 1) * filters.pageLimit;

    const dbModels = await prisma.donationRequestPost.findMany({
      where: { wilayaNumber: filters.wilayaNumber?.value() },
      orderBy: { createdAt: 'desc' },
      skip: numOfPostsToSkip,
      take: filters.pageLimit,
    });

    return dbModels.map(model => this.toEntity(model));
  }

  async count(filters: CountFilters): Promise<number> {
    const total = await prisma.donationRequestPost.count({
      where: {
        wilayaNumber: filters.wilayaNumber?.value(),
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
      .withPublisherId(new PublisherId(dbModel.publisherId))
      .withCreatedAt(dbModel.createdAt)
      .build();
  }
}

export { PostgresDonationRequestPostRepository };
