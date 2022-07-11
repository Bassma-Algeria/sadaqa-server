import { PostId } from '../PostId';

export interface PostIdGenerator {
  nextId(): PostId;
}
