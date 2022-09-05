import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../src/web/rest/app.module';
import { prisma } from '../../src/components/_shared_/persistence/prisma/PrismaClient';

const startNestTestingApp = async (): Promise<INestApplication> => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    return moduleRef.createNestApplication().init();
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
