import { RegionsManagerFacade } from './RegionsManagerFacade';
import { PostgresWilayasRepository } from './infra/real/PostgresWilayasRepository';

/** @deprecated should use RegionsManagerFactory from the regions-manager instead */
class RegionsManagerConfiguration {
    static aRegionsManagerFacade() {
        return new RegionsManagerFacade(new PostgresWilayasRepository());
    }
}

export { RegionsManagerConfiguration };
