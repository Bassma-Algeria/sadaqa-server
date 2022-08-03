import { InvalidFileSizeException } from './exceptions/InvalidFileSizeException';

class FileSize {
    static readonly ONE_MEGA_BYTE = 2 ** 20;

    private readonly bytes: number;

    constructor(inBytes: number) {
        if (inBytes < 0) throw new InvalidFileSizeException();

        this.bytes = inBytes;
    }

    inMegaBytes() {
        return this.bytes / FileSize.ONE_MEGA_BYTE;
    }
}

export { FileSize };
