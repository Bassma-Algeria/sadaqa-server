import os from 'os';
import * as fs from 'node:fs/promises';

import { ErrorLog } from '../core/domain/ErrorLog';
import { InformationLog } from '../core/domain/InformationLog';

import { LogService } from '../core/domain/services/LogService';
import path from 'path';

class LogServiceImpl implements LogService {
    private readonly INFO_LOG_FILE = path.join(__dirname, '../../logs/info.log');
    private readonly ERROR_LOG_FILE = path.join(__dirname, '../../logs/error.log');

    async info(infoLog: InformationLog): Promise<void> {
        await fs.appendFile(
            this.INFO_LOG_FILE,
            JSON.stringify({
                timestamp: infoLog.timestamp,
                message: infoLog.message,
                payload: infoLog.payload,
            }) + os.EOL,
        );
    }

    async error(errorLog: ErrorLog): Promise<void> {
        await fs.appendFile(
            this.ERROR_LOG_FILE,
            JSON.stringify({
                timestamp: errorLog.timestamp,
                message: errorLog.message,
                stack: errorLog.stack,
            }) + os.EOL,
        );
    }
}

export { LogServiceImpl };
