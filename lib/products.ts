export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'pdfly-pro-monthly',
    name: 'PDFly Pro Monthly',
    description: 'Unlimited PDF conversions, no ads, priority processing',
    priceInCents: 499, // $4.99/month
  },
  {
    id: 'pdfly-pro-yearly',
    name: 'PDFly Pro Yearly',
    description: 'Unlimited PDF conversions, no ads, priority processing - Save 40%',
    priceInCents: 3588, // $35.88/year ($2.99/month)
  },
]
