import { PostShare } from '../../../core/domain/PostShare';

import { PostShareRepository } from '../../../core/domain/services/PostRepository/PostShareRepository';

import { prisma } from '../../../../../_shared_/persistence/prisma/PrismaClient';

interface DBModel {
    postId: string;
    postType: string;
    userId: string | null;
    createdAt: Date;
}

class PostgresPostShareRepository implements PostShareRepository {
    async findMany(): Promise<PostShare[]> {
        const shares = await prisma.postShare.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return shares.map(this.toEntity);
    }

    async save(share: PostShare): Promise<void> {
        await prisma.postShare.create({ data: this.toDBModel(share) });
    }

    private toDBModel(share: PostShare): DBModel {
        return {
            postId: share.state.postId,
            postType: share.state.postType,
            createdAt: share.state.createdAt,
            userId: share.state.userId,
        };
    }

    private toEntity(model: DBModel): PostShare {
        return PostShare.fromState(model);
    }
}

export { PostgresPostShareRepository };
