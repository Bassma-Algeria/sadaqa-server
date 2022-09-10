import { AuthenticationManagerFacade } from '../../../../main/AuthenticationManagerFacade';
import { JwtTokenizationService } from '../../../../main/infra/real/JwtTokenizationService';

const anAuthenticationManager = () => {
    return new AuthenticationManagerFacade(new JwtTokenizationService());
};

export { anAuthenticationManager };
