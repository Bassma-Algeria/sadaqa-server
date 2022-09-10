import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { WilayasService } from '../../core/domain/services/WilayasService';

import { RegionsManagerFacade } from '../../../../RegionsManager/main/RegionsManagerFacade';

class WilayasServiceImpl implements WilayasService {
    constructor(private readonly regionsManager: RegionsManagerFacade) {}

    async isExist(wilayaNumber: WilayaNumber): Promise<boolean> {
        try {
            await this.regionsManager.getWilaya({ wilayaNumber: wilayaNumber.value() });

            return true;
        } catch (e) {
            return false;
        }
    }
}

export { WilayasServiceImpl };
