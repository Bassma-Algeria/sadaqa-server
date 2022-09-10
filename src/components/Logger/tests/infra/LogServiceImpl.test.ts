import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import readline from 'readline';
import { faker } from '@faker-js/faker';
import * as fsPromise from 'node:fs/promises';

import { ErrorLog } from '../../main/core/domain/ErrorLog';
import { InformationLog } from '../../main/core/domain/InformationLog';

import { LogServiceImpl } from '../../main/infra/LogServiceImpl';

describe('Log Service Impl', () => {
    const logService = LogServiceImpl.instance();

    const INFO_LOG_FILES_DIR = path.join(__dirname, '../../logs/info.log');
    const ERROR_LOG_FILES_DIR = path.join(__dirname, '../../logs/error.log');

    beforeEach(async () => {
        await fsPromise.writeFile(INFO_LOG_FILES_DIR, '');
        await fsPromise.writeFile(ERROR_LOG_FILES_DIR, '');
    });

    it('should write the info log in the info.log file', async () => {
        const message = faker.lorem.words(6);
        const payload = { data: faker.lorem.text() };
        const timestamp = faker.date.recent();

        await logService.info(new InformationLog(message, payload, timestamp));

        const fileContent = await readFile(INFO_LOG_FILES_DIR);

        expect(fileContent).to.have.lengthOf(1);
        expect(fileContent[0]).to.have.property('timestamp');
        expect(fileContent[0]).to.have.property('message').equal(message);
        expect(fileContent[0]).to.have.property('payload').deep.equal(payload);
    });

    it('should not override the existing logs when writing a new info log in the info.log file', async () => {
        const message = faker.lorem.words(6);
        const payload = { data: faker.lorem.text() };
        const timestamp = faker.date.recent();

        await logService.info(new InformationLog(message, payload, timestamp));
        await logService.info(new InformationLog(message, payload, timestamp));

        const fileContent = await readFile(INFO_LOG_FILES_DIR);

        expect(fileContent).to.have.lengthOf(2);
    });

    it('should write the error log in the error.log file', async () => {
        const message = faker.lorem.words(6);
        const timestamp = faker.date.recent();
        const error = new Error(message);

        await logService.error(new ErrorLog(message, error.stack, timestamp));

        const fileContent = await readFile(ERROR_LOG_FILES_DIR);

        expect(fileContent).to.have.lengthOf(1);
        expect(fileContent[0]).to.have.property('timestamp');
        expect(fileContent[0]).to.have.property('message').equal(message);
        expect(fileContent[0]).to.have.property('stack').equal(error.stack);
    });

    it('should not override the existing logs when writing a new error log in the error.log file', async () => {
        const message = faker.lorem.words(6);
        const timestamp = faker.date.recent();
        const error = new Error(message);

        await logService.error(new ErrorLog(message, error.stack, timestamp));
        await logService.error(new ErrorLog(message, error.stack, timestamp));

        const fileContent = await readFile(ERROR_LOG_FILES_DIR);

        expect(fileContent).to.have.lengthOf(2);
    });

    const readFile = (filePath: string): Promise<any[]> => {
        return new Promise(resolve => {
            const chunks: any[] = [];

            const readInterface = readline.createInterface({
                input: fs.createReadStream(filePath),
            });

            readInterface.on('line', line => chunks.push(JSON.parse(`${line}`)));

            readInterface.on('close', () => resolve(chunks));
        });
    };
});
