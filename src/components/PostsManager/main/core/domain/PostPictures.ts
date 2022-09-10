import { Picture } from './Picture';

class PostPictures {
    static fromState(state: PostPictures['state']) {
        return new PostPictures(state.map(pic => new Picture(pic)));
    }

    constructor(private readonly pictures: Picture[]) {}

    get state() {
        return this.pictures.map(pic => pic.url());
    }

    *iterator() {
        for (const picture of this.pictures) yield picture;
    }

    have(picture: Picture) {
        return !!this.pictures.find(pic => pic.equals(picture));
    }
}

export { PostPictures };
