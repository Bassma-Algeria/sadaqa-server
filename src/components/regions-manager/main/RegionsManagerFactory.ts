import { RegionsManager } from './RegionsManager';
import { RegionsManagerFacade } from './RegionsManagerFacade';

import { PostgresWilayasRepository } from './infra/PostgresWilayasRepository';

import { WilayaDbClient } from '../../persistence/postgres/prisma/PrismaClients';

class RegionsManagerFactory {
    static aRegionsManager(wilayaDbClient: WilayaDbClient): RegionsManager {
        return new RegionsManagerFacade(new PostgresWilayasRepository(wilayaDbClient));
    }
}

export { RegionsManagerFactory };
