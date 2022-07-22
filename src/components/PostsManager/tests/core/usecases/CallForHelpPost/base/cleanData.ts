import { PostgresCallForHelpPostRepository } from '../../../../../main/infra/real/PostgresCallForHelpPostRepository';

const cleanData = async () => {
  await new PostgresCallForHelpPostRepository().deleteAll();
};

export { cleanData };
