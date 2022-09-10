import { LogInfoUseCase } from './core/usecases/LogInfoUseCase/LogInfoUseCase';
import { LogInfoUseCaseRequest } from './core/usecases/LogInfoUseCase/LogInfoUseCaseRequest';

import { LogErrorUseCase } from './core/usecases/LogErrorUseCase/LogErrorUseCase';
import { LogErrorUseCaseRequest } from './core/usecases/LogErrorUseCase/LogErrorUseCaseRequest';

import { LogService } from './core/domain/services/LogService';

class LoggerFacade {
    constructor(private readonly logService: LogService) {}

    info(request: LogInfoUseCaseRequest) {
        return new LogInfoUseCase(this.logService).handle(request);
    }

    error(request: LogErrorUseCaseRequest) {
        return new LogErrorUseCase(this.logService).handle(request);
    }
}

export { LoggerFacade };
