import { RegionsManager } from '../../main/RegionsManager';
import { RegionsManagerFacade } from '../../main/RegionsManagerFacade';

const aRegionsManagerFacade = (): RegionsManager => {
    return new RegionsManagerFacade();
};

export { aRegionsManagerFacade };
