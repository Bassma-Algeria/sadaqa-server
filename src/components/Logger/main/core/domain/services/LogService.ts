import { ErrorLog } from '../ErrorLog';
import { InformationLog } from '../InformationLog';

export interface LogService {
    info(infoLog: InformationLog): Promise<void>;

    error(errorLog: ErrorLog): Promise<void>;
}
