import { RegionsManager } from '../../main/RegionsManager';
import { RegionsManagerFactory } from '../../main/RegionsManagerFactory';

import { PrismaClientsFactory } from '../../../persistence/postgres/prisma/PrismaClientsFactory';

const aRegionsManager = (): RegionsManager => {
    return RegionsManagerFactory.aRegionsManager(PrismaClientsFactory.aWilayaDbClient());
};

export { aRegionsManager };
