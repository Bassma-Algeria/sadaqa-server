import { PostgresCallForHelpPostRepository } from '../../../../../main/infra/real/PostgresPostRepository/PostgresCallForHelpPostRepository';

const cleanData = async () => {
    await new PostgresCallForHelpPostRepository().deleteAll();
};

export { cleanData };
