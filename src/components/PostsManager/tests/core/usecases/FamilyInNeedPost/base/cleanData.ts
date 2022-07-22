import { PostgresFamilyInNeedPostRepository } from '../../../../../main/infra/real/PostgresFamilyInNeedPostRepository';

const cleanData = async () => {
  await new PostgresFamilyInNeedPostRepository().deleteAll();
};

export { cleanData };
