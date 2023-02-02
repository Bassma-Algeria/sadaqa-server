import { RegionsManager } from './RegionsManager';
import { RegionsManagerFacade } from './RegionsManagerFacade';

import { PostgresWilayasRepository } from './infra/PostgresWilayasRepository';

class RegionsManagerFactory {
    static aRegionsManager(): RegionsManager {
        return new RegionsManagerFacade(new PostgresWilayasRepository());
    }
}

export { RegionsManagerFactory };
