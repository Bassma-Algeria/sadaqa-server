import { RegionsManagerFactory } from '../main/RegionsManagerFactory';
import { expect } from 'chai';
import { NotFoundException } from '../main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../main/core/domain/exceptions/ValidationException';

describe('Get Wilaya By Code', () => {
    const regionsManager = RegionsManagerFactory.aRegionsManager();

    it('given a wilaya code that does not exist, then should fail', async () => {
        const wilayaCode = 1000;

        const error = await expect(regionsManager.getWilayaByCode(wilayaCode))
            .to.eventually.be.rejectedWith('no wilaya found with the given code')
            .and.to.be.an.instanceOf(NotFoundException);

        expect(error).to.have.property('code', 'REGIONS.WILAYA.NOT_FOUND');
        expect(error).to.have.property('error', 'no wilaya found with the given code');
    });

    it('given a negative wilaya code, then should fail', async () => {
        const wilayaCode = -1;

        const error = await expect(regionsManager.getWilayaByCode(wilayaCode))
            .to.eventually.be.rejectedWith('wilaya code should be > 0')
            .and.to.be.an.instanceOf(ValidationException);

        expect(error).to.have.property('code', 'REGIONS.WILAYA_CODE.CANNOT_BE_NEGATIVE');
        expect(error).to.have.property('error', 'wilaya code should be > 0');
    });

    it('given a null wilaya code, then should fail', async () => {
        const wilayaCode = 0;

        const error = await expect(regionsManager.getWilayaByCode(wilayaCode))
            .to.eventually.be.rejectedWith('wilaya code cannot be 0')
            .and.to.be.an.instanceOf(ValidationException);

        expect(error).to.have.property('code', 'REGIONS.WILAYA_CODE.CANNOT_BE_ZERO');
        expect(error).to.have.property('error', 'wilaya code cannot be 0');
    });

    it('given an existing wilaya code, then should return the wilaya info', async () => {
        const wilayaCode = 1;

        await expect(regionsManager.getWilayaByCode(wilayaCode)).to.eventually.deep.equal({
            code: 1,
            name: 'adrar',
        });
    });
});
