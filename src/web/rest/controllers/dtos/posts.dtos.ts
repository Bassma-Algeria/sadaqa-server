import { ApiProperty } from '@nestjs/swagger';

import { DonationCategory } from '../../../../components/PostsManager/main/core/domain/DonationCategory';

class CreateDonationDto {
  @ApiProperty({ minLength: 3 })
  readonly title!: string;

  @ApiProperty()
  readonly description!: string;

  @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
  readonly category!: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber!: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly pictures!: any[];
}

class CreateDonationRequestDto {
  @ApiProperty({ minLength: 3 })
  readonly title!: string;

  @ApiProperty()
  readonly description!: string;

  @ApiProperty({ enum: DonationCategory.SUPPORTED_CATEGORIES })
  readonly category!: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber!: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly pictures!: any[];
}

class CreateFamilyInNeedDto {
  @ApiProperty({ minLength: 3 })
  readonly title!: string;

  @ApiProperty()
  readonly description!: string;

  @ApiProperty()
  readonly publisherId!: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber!: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly pictures!: any[];

  @ApiProperty()
  readonly ccp?: string;

  @ApiProperty()
  readonly ccpKey?: string;

  @ApiProperty()
  readonly baridiMobNumber?: string;
}

class CreateCallForHelpDto {
  @ApiProperty({ minLength: 3 })
  readonly title!: string;

  @ApiProperty()
  readonly description!: string;

  @ApiProperty()
  readonly publisherId!: string;

  @ApiProperty({ minimum: 1, maximum: 58 })
  readonly wilayaNumber!: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  readonly pictures!: any[];

  @ApiProperty()
  readonly ccp?: string;

  @ApiProperty()
  readonly ccpKey?: string;

  @ApiProperty()
  readonly baridiMobNumber?: string;
}

export { CreateDonationDto, CreateFamilyInNeedDto, CreateCallForHelpDto, CreateDonationRequestDto };
