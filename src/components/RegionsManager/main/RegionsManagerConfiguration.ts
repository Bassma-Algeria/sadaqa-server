import { RegionsManagerFacade } from './RegionsManagerFacade';
import { PostgresWilayasRepository } from './infra/real/PostgresWilayasRepository';

class RegionsManagerConfiguration {
    static aRegionsManagerFacade() {
        return new RegionsManagerFacade(new PostgresWilayasRepository());
    }
}

export { RegionsManagerConfiguration };
