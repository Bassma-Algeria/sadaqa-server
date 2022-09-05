import { GeneralPostOperationsManagerFacade } from '../../../../main/core/GeneralPostOperationsManagerFacade';

import { PostgresPostShareRepository } from '../../../../main/infra/real/PostgresPostRepository/PostgresPostShareRepository';

const aGeneralPostOperationsManager = () => {
    return new GeneralPostOperationsManagerFacade(new PostgresPostShareRepository());
};

export { aGeneralPostOperationsManager };
