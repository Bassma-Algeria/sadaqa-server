import { faker } from '@faker-js/faker';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { aLogger } from './base/aLogger';

import { LogService } from '../../main/core/domain/services/LogService';

describe('Info Log', () => {
    const logServiceMock = mock<LogService>();
    const logger = aLogger({ logService: instance(logServiceMock) });

    beforeEach(() => {
        when(logServiceMock.info(anything())).thenResolve();
    });

    it('should log the information passed to it', async () => {
        await logger.info({ message: faker.lorem.words(7), payload: faker.random.words() });

        verify(logServiceMock.info(anything())).once();
    });
});
