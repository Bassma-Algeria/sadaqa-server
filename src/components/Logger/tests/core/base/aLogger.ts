import { anything, instance, mock, when } from 'ts-mockito';

import { LoggerFacade } from '../../../main/LoggerFacade';

import { LogService } from '../../../main/core/domain/services/LogService';

interface Dependencies {
    logService?: LogService;
}

const aLogger = (depends?: Dependencies) => {
    const logServiceMock = mock<LogService>();

    when(logServiceMock.info(anything())).thenResolve();
    when(logServiceMock.error(anything())).thenResolve();

    return new LoggerFacade(depends?.logService || instance(logServiceMock));
};

export { aLogger };
