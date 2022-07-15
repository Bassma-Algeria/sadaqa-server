import { ApiProperty } from '@nestjs/swagger';
import { DonationCategory } from '../../../../components/PostsManager/main/core/domain/DonationCategory';

class CreateDonationDto {
  @ApiProperty({ minLength: 3 })
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
  readonly category: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly pictures: any[];
}

export { CreateDonationDto };
