import { LoggerFacade } from './LoggerFacade';

import { LogServiceImpl } from './infra/LogServiceImpl';

class LoggerConfiguration {
    static aLogger() {
        return new LoggerFacade(new LogServiceImpl());
    }
}

export { LoggerConfiguration };
