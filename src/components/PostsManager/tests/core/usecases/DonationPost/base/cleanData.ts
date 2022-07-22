import { PostgresDonationPostRepository } from '../../../../../main/infra/real/PostgresDonationPostRepository';

const cleanData = async () => {
  await new PostgresDonationPostRepository().deleteAll();
};

export { cleanData };
