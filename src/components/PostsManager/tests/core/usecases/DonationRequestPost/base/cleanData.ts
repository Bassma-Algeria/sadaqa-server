import { PostgresDonationRequestPostRepository } from '../../../../../main/infra/real/PostgresDonationRequestRepository';

const cleanData = async () => {
  await new PostgresDonationRequestPostRepository().deleteAll();
};

export { cleanData };
