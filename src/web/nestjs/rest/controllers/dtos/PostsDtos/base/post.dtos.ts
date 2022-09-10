import { ApiProperty } from '@nestjs/swagger';

class CreatePostDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly pictures!: any[];
}

class UpdatePostDto {
    @ApiProperty({ minLength: 3 })
    readonly title!: string;

    @ApiProperty()
    readonly description!: string;

    @ApiProperty({ minimum: 1, maximum: 58 })
    readonly wilayaNumber!: number;

    @ApiProperty({ description: 'the urls of the old pictures to keep' })
    readonly oldPictures!: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    readonly newPictures!: any[];
}

export { UpdatePostDto, CreatePostDto };