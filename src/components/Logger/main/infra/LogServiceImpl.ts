import os from 'os';
import fs from 'fs';
import path from 'path';
import * as fsPromise from 'node:fs/promises';

import { ErrorLog } from '../core/domain/ErrorLog';
import { InformationLog } from '../core/domain/InformationLog';

import { LogService } from '../core/domain/services/LogService';

class LogServiceImpl implements LogService {
    private readonly INFO_LOG_FILE = path.join(__dirname, '../../logs/info.log');
    private readonly ERROR_LOG_FILE = path.join(__dirname, '../../logs/error.log');

    private static _instance: LogService = new LogServiceImpl();

    static instance() {
        return this._instance;
    }

    private constructor() {
        this.createFileIfNotExist(this.INFO_LOG_FILE);
        this.createFileIfNotExist(this.ERROR_LOG_FILE);
    }

    async info(infoLog: InformationLog): Promise<void> {
        await fsPromise.appendFile(
            this.INFO_LOG_FILE,
            JSON.stringify({
                timestamp: infoLog.timestamp,
                message: infoLog.message,
                payload: infoLog.payload,
            }) + os.EOL,
        );
    }

    async error(errorLog: ErrorLog): Promise<void> {
        await fsPromise.appendFile(
            this.ERROR_LOG_FILE,
            JSON.stringify({
                timestamp: errorLog.timestamp,
                message: errorLog.message,
                stack: errorLog.stack,
            }) + os.EOL,
        );
    }

    private createFileIfNotExist(filepath: string) {
        if (!fs.existsSync(path.dirname(filepath))) fs.mkdirSync(path.dirname(filepath));
        if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, '');
    }
}

export { LogServiceImpl };
