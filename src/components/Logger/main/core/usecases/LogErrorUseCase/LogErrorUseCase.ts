import { UseCase } from '../UseCase';
import { LogErrorUseCaseRequest } from './LogErrorUseCaseRequest';

import { ErrorLog } from '../../domain/ErrorLog';
import { LogService } from '../../domain/services/LogService';

class LogErrorUseCase implements UseCase<LogErrorUseCaseRequest, void> {
    constructor(private readonly logService: LogService) {}

    async handle(request: LogErrorUseCaseRequest): Promise<void> {
        const log = new ErrorLog(request.message, request.stack, new Date());

        await this.logService.error(log);
    }
}

export { LogErrorUseCase };
