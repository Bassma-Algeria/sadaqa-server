import { stub } from 'sinon';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { FakeWilayasRepository } from '../../../main/infra/fake/FakeWilayasRepository';

import { WilayaName } from '../../../main/core/domain/WilayaName';
import { WilayaNumber } from '../../../main/core/domain/WilayaNumber';
import { RegionsManagerFacade } from '../../../main/RegionsManagerFacade';
import { WilayaNotExistException } from '../../../main/core/domain/exceptions/WilayaNotExistException';

describe('GetWilayaUseCase', () => {
    const EXISTING_WILAYA_NUMBER = 30;
    const NOT_EXISTING_WILAYA_NUMBER = 203;

    const fakeWilayasRepository = new FakeWilayasRepository();
    const regionsManagerFacade = new RegionsManagerFacade(fakeWilayasRepository);

    it('should get the wilaya name in english and arabic for a valid wilaya number', async () => {
        const wilayaName = new WilayaName({ en: faker.address.city(), ar: faker.address.city() });
        const wilayaNumber = new WilayaNumber(EXISTING_WILAYA_NUMBER);
        const getWilayaStub = stub(fakeWilayasRepository, 'getByNumber').callsFake(() =>
            Promise.resolve({ wilayaNumber, wilayaName }),
        );

        const { name } = await regionsManagerFacade.getWilaya({
            wilayaNumber: EXISTING_WILAYA_NUMBER,
        });

        expect(name.ar).to.not.equal('');
        expect(name.en).to.not.equal('');

        getWilayaStub.restore();
    });

    it('should be rejected when the wilaya number not exist', async () => {
        const getWilayaStub = stub(fakeWilayasRepository, 'getByNumber').callsFake(() =>
            Promise.resolve(undefined),
        );

        await expect(
            regionsManagerFacade.getWilaya({ wilayaNumber: NOT_EXISTING_WILAYA_NUMBER }),
        ).to.eventually.be.rejectedWith(WilayaNotExistException);

        getWilayaStub.restore();
    });
});
