import { PostgresDonationPostRepository } from '../../../../../main/infra/real/PostgresPostRepository/PostgresDonationPostRepository';

const cleanData = async () => {
    await new PostgresDonationPostRepository().deleteAll();
};

export { cleanData };
