import { PostgresFamilyInNeedPostRepository } from '../../../../../main/infra/real/PostgresPostRepository/PostgresFamilyInNeedPostRepository';

const cleanData = async () => {
    await new PostgresFamilyInNeedPostRepository().deleteAll();
};

export { cleanData };
