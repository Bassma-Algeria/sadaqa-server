import { FakeTokenizationService } from '../../../../main/infra/fake/FakeTokenizationService';
import { AuthenticationManagerFacade } from '../../../../main/AuthenticationManagerFacade';

const createAuthenticationManagerFacade = () => {
    return new AuthenticationManagerFacade(new FakeTokenizationService());
};

export { createAuthenticationManagerFacade };
