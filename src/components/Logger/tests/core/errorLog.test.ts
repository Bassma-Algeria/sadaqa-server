import { faker } from '@faker-js/faker';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { aLogger } from './base/aLogger';

import { LogService } from '../../main/core/domain/services/LogService';

describe('Error Log', () => {
    const logServiceMock = mock<LogService>();
    const logger = aLogger({ logService: instance(logServiceMock) });

    beforeEach(() => {
        when(logServiceMock.error(anything())).thenResolve();
    });

    it('should log the information passed to it', async () => {
        await logger.error({
            message: faker.lorem.words(7),
            stack: faker.random.words(),
        });

        verify(logServiceMock.error(anything())).once();
    });
});
