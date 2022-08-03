import { PostgresDonationRequestPostRepository } from '../../../../../main/infra/real/PostgresPostRepository/PostgresDonationRequestRepository';

const cleanData = async () => {
    await new PostgresDonationRequestPostRepository().deleteAll();
};

export { cleanData };
