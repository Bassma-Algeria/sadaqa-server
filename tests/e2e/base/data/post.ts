import { faker } from '@faker-js/faker';

const DONATION_CATEGORIES = [
  'clothes-accessories',
  'food',
  'services',
  'electronics-appliances',
  'home-furnitures',
  'books-magazines',
  'sports',
  'cosmetics-hygiene',
  'animales-accessories',
  'toys',
  'tools',
  'health-medicines',
  'cars-accessories',
  'others',
] as const;

interface DonationCreationbody {
  readonly title: string;
  readonly description: string;
  readonly wilayaNumber: number;
  readonly publisherId: string;
  readonly category: typeof DONATION_CATEGORIES[number];
  readonly pictures: any[];
}

const aDonationCreationBody = (info?: Partial<DonationCreationbody>): DonationCreationbody => {
  return {
    title: faker.definitions.title,
    category:
      DONATION_CATEGORIES[faker.datatype.number({ min: 0, max: DONATION_CATEGORIES.length - 1 })],
    description: faker.datatype.string(40),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    pictures: [],
    publisherId: faker.datatype.uuid(),
    ...info,
  };
};

export { aDonationCreationBody };
