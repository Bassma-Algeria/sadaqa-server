import { expect } from 'chai';
import { aRegionsManager } from './builders/aRegionsManager';

describe('Get All Wilayas', () => {
    const regionsManager = aRegionsManager();

    it('should get all the 58 algerian wilayas', async () => {
        const wilayas = await regionsManager.getAlgerianWilayas();

        expect(wilayas.length).to.equal(58);
    });

    it('should get the wilayas ordered by there codes', async () => {
        const wilayas = await regionsManager.getAlgerianWilayas();

        expect(wilayas[0]).to.deep.equal({ code: 1, name: 'adrar' });
        expect(wilayas[15]).to.deep.equal({ code: 16, name: 'alger' });
        expect(wilayas[57]).to.deep.equal({ code: 58, name: 'el-menia' });
    });
});
