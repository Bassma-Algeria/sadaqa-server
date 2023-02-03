import { PrismaClient } from '@prisma/client';

import { WilayaDbClient } from './PrismaClients';

class PrismaClientsFactory {
    private static readonly prisma = new PrismaClient();

    static aWilayaDbClient(): WilayaDbClient {
        return PrismaClientsFactory.prisma.wilaya;
    }
}

export { PrismaClientsFactory };
