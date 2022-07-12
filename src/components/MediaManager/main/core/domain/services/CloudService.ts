import { URL } from '../URL';
import { Picture } from '../Picture';

export interface CloudService {
  upload(picture: Picture): Promise<URL>;
}
