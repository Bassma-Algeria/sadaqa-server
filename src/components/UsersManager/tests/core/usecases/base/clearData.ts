import { PostgresRegularUserAccountRepository } from '../../../../main/infra/real/PostgresRegularUserAccountRepository';
import { PostgresAssociationAccountRepository } from '../../../../main/infra/real/PostgresAssociationAccountRepository';

const clearData = async () => {
    await new PostgresRegularUserAccountRepository().deleteAll();
    await new PostgresAssociationAccountRepository().deleteAll();
};

export { clearData };