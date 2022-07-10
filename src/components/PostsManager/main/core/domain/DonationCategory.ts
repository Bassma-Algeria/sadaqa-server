import { CategoryNotSupportedException } from './exceptions/CategoryNotSupportedException';

class DonationCategory {
  public static readonly SUPPORTED_CATEGORIES = [
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

  private readonly category: string;

  constructor(category: string) {
    if (!DonationCategory.SUPPORTED_CATEGORIES.includes(category as any))
      throw new CategoryNotSupportedException();

    this.category = category;
  }

  value() {
    return this.category as typeof DonationCategory.SUPPORTED_CATEGORIES[number];
  }
}

export { DonationCategory };
