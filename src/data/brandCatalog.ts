export interface BrandCatalogGroup {
  sector: string;
  brands: string[];
}

export const BRAND_CATALOG: BrandCatalogGroup[] = [
  { sector: 'Payments / Fintech', brands: ['Paytm', 'PhonePe', 'Google Pay', 'Razorpay'] },
  { sector: 'Banking', brands: ['HDFC Bank', 'ICICI Bank'] },
  { sector: 'E-Commerce', brands: ['Amazon', 'Flipkart', 'Meesho'] },
  { sector: 'Technology', brands: ['Microsoft', 'Google', 'Apple', 'Adobe'] },
  { sector: 'Telecom', brands: ['Jio', 'Airtel'] },
  { sector: 'Food / Delivery', brands: ['Zomato', 'Swiggy'] },
  { sector: 'Travel / Hospitality', brands: ['MakeMyTrip', 'OYO'] },
  { sector: 'Sports / Lifestyle', brands: ['Nike', 'Adidas'] },
  { sector: 'Entertainment', brands: ['Netflix', 'Spotify'] },
];

export const BUILT_IN_BRANDS = BRAND_CATALOG.flatMap((group) => group.brands);

export function normalizeBrandCatalogKey(value: string): string {
  return value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isBuiltInBrand(value: string): boolean {
  const key = normalizeBrandCatalogKey(value);
  return BUILT_IN_BRANDS.some((brand) => normalizeBrandCatalogKey(brand) === key);
}
