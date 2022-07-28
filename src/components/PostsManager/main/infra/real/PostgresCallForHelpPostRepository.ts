import {
  CallForHelpPostRepository,
  CountFilters,
  FindManyFilters,
} from '../../core/domain/services/CallForHelpPostRepository';

import { CCP } from '../../core/domain/CCP';
import { Title } from '../../core/domain/Title';
import { PostId } from '../../core/domain/PostId';
import { UserId } from '../../core/domain/UserId';
import { Picture } from '../../core/domain/Picture';
import { PostStatus } from '../../core/domain/PostStatus';
import { Description } from '../../core/domain/Description';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { BaridiMobNumber } from '../../core/domain/BaridiMobNumber';

import { CallForHelpPost } from '../../core/domain/CallForHelpPost';

import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

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
      where: { postId: post.postId.value() },
      data: this.toDBModel(post),
    });
  }

  async findMany({ wilayaNumber, pageLimit, page }: FindManyFilters): Promise<CallForHelpPost[]> {
    const numOfPostsToSkip = (page - 1) * pageLimit;

    const posts = await prisma.callForHelpPost.findMany({
      where: { wilayaNumber: wilayaNumber?.value() },
      orderBy: { createdAt: 'desc' },
      skip: numOfPostsToSkip,
      take: pageLimit,
    });

    return posts.map(post => this.toEntity(post));
  }

  async count(filters?: CountFilters): Promise<number> {
    const total = await prisma.callForHelpPost.count({
      where: { wilayaNumber: filters?.wilayaNumber?.value() },
    });

    return total;
  }

  async delete(id: PostId): Promise<void> {
    await prisma.callForHelpPost.delete({ where: { postId: id.value() } });
  }

  async deleteAll() {
    await prisma.callForHelpPost.deleteMany();
  }

  private toEntity(model: DBModel): CallForHelpPost {
    return CallForHelpPost.aBuilder()
      .withPostId(new PostId(model.postId))
      .withTitle(new Title(model.title))
      .withDescription(new Description(model.description))
      .withWilayaNumber(new WilayaNumber(model.wilayaNumber))
      .withPublisherId(new UserId(model.publisherId))
      .withPictures(model.pictures.map(pic => new Picture(pic)))
      .withCCP(model.ccp ? new CCP(model.ccp, model.ccpKey!) : undefined)
      .withStatus(model.status as PostStatus)
      .withBaridiMobNumber(
        model.baridiMobNumber ? new BaridiMobNumber(model.baridiMobNumber) : undefined,
      )
      .withCreatedAt(model.createdAt)
      .build();
  }

  private toDBModel(post: CallForHelpPost): DBModel {
    return {
      postId: post.postId.value(),
      title: post.title.value(),
      description: post.description.value(),
      publisherId: post.publisherId.value(),
      wilayaNumber: post.wilayaNumber.value(),
      pictures: post.pictures.map(pic => pic.url()),
      ccp: post.ccp?.number() || null,
      ccpKey: post.ccp?.key() || null,
      status: post.status,
      baridiMobNumber: post.baridiMobNumber?.value() || null,
      createdAt: post.createdAt,
    };
  }
}

export { PostgresCallForHelpPostRepository };
