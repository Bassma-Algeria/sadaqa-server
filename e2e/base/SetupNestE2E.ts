import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../src/web/nestjs/app.module';
import { prisma } from '../../src/components/_shared_/persistence/prisma/PrismaClient';

let app: INestApplication | undefined;

const startNestTestingApp = async (): Promise<INestApplication> => {
    if (app) return app;

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = await moduleRef.createNestApplication().init();

    return app;
};

const cleanupDB = async () => {
    await prisma.regularUserAccount.deleteMany();
    await prisma.associationAccount.deleteMany();
    await prisma.donationPost.deleteMany();
    await prisma.donationRequestPost.deleteMany();
    await prisma.callForHelpPost.deleteMany();
    await prisma.familyInNeedPost.deleteMany();
    await prisma.favouritePost.deleteMany();
};

export { cleanupDB, startNestTestingApp };
