import { RegionsManager } from './regions-manager/main/RegionsManager';
import { RegionsManagerFactory } from './regions-manager/main/RegionsManagerFactory';

import { PrismaClientsFactory } from './persistence/postgres/prisma/PrismaClientsFactory';

class ManagersFactory {
    static aRegionsManager(): RegionsManager {
        return RegionsManagerFactory.aRegionsManager(PrismaClientsFactory.aWilayaDbClient());
    }
}
