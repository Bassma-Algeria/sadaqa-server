import { AuthenticationManagerFacade } from './AuthenticationManagerFacade';
import { JwtTokenizationService } from './infra/real/JwtTokenizationService';

class AuthenticationManagerConfiguration {
  static anAuthenticationManagerFacade(): AuthenticationManagerFacade {
    return new AuthenticationManagerFacade(new JwtTokenizationService());
  }
}

export { AuthenticationManagerConfiguration };
