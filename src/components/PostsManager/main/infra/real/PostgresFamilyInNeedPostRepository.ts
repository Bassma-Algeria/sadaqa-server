import {
  CountFilters,
  FamilyInNeedPostRepository,
  FindManyFilters,
} from '../../core/domain/services/FamilyInNeedPostRepository';

import { CCP } from '../../core/domain/CCP';
import { Title } from '../../core/domain/Title';
import { PostId } from '../../core/domain/PostId';
import { Picture } from '../../core/domain/Picture';
import { PublisherId } from '../../core/domain/PublisherId';
import { Description } from '../../core/domain/Description';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { BaridiMobNumber } from '../../core/domain/BaridiMobNumber';

import { FamilyInNeedPost } from '../../core/domain/FamilyInNeedPost';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

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

  async findMany({ wilayaNumber, pageLimit, page }: FindManyFilters): Promise<FamilyInNeedPost[]> {
    const numOfPostsToSkip = (page - 1) * pageLimit;

    const posts = await prisma.familyInNeedPost.findMany({
      where: { wilayaNumber: wilayaNumber?.value() },
      orderBy: { createdAt: 'desc' },
      skip: numOfPostsToSkip,
      take: pageLimit,
    });

    return posts.map(post => this.toEntity(post));
  }

  async count(filters?: CountFilters): Promise<number> {
    const total = await prisma.familyInNeedPost.count({
      where: { wilayaNumber: filters?.wilayaNumber?.value() },
    });

    return total;
  }

  async deleteAll() {
    await prisma.familyInNeedPost.deleteMany();
  }

  private toEntity(model: DBModel): FamilyInNeedPost {
    return FamilyInNeedPost.aBuilder()
      .withPostId(new PostId(model.postId))
      .withTitle(new Title(model.title))
      .withDescription(new Description(model.description))
      .withWilayaNumber(new WilayaNumber(model.wilayaNumber))
      .withPublisherId(new PublisherId(model.publisherId))
      .withPictures(model.pictures.map(pic => new Picture(pic)))
      .withCCP(model.ccp ? new CCP(model.ccp, model.ccpKey!) : undefined)
      .withBaridiMobNumber(
        model.baridiMobNumber ? new BaridiMobNumber(model.baridiMobNumber) : undefined,
      )
      .withCreatedAt(model.createdAt)
      .build();
  }

  private toDBModel(post: FamilyInNeedPost): DBModel {
    return {
      postId: post.postId.value(),
      title: post.title.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      ccp: post.ccp?.number() || null,
      ccpKey: post.ccp?.key() || null,
      baridiMobNumber: post.baridiMobNumber?.value() || null,
      createdAt: post.createdAt,
    };
  }
}

export { PostgresFamilyInNeedPostRepository };
