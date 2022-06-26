import { faker } from '@faker-js/faker';

const POST_TYPES = [
  'donations',
  'donation-requests',
  'families-in-need',
  'calls-for-help',
] as const;
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
  type: Exclude<typeof POST_TYPES[number], 'families-in-need' | 'calls-for-help'>;
  title: string;
  description: string;
  wilaya: number;
  category: typeof DONATION_CATEGORIES[number];
  pictures: File[];
}

interface NeedHelpPostCreationBody {
  type: Exclude<typeof POST_TYPES[number], 'donations' | 'donation-requests'>;
  title: string;
  description: string;
  wilaya: number;
  ccp: string;
  ccpKey: string;
  rib: string;
  pictures: File[];
}

const getDonationCreationInfo = (info?: Partial<DonationCreationbody>): DonationCreationbody => {
  return {
    type: 'donation-requests',
    title: faker.definitions.title,
    category:
      DONATION_CATEGORIES[faker.datatype.number({ min: 0, max: DONATION_CATEGORIES.length - 1 })],
    description: faker.datatype.string(40),
    pictures: [],
    wilaya: faker.datatype.number({ min: 1, max: 58 }),
    ...info,
  };
};

export { getDonationCreationInfo };
