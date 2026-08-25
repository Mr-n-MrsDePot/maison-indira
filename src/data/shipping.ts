export type ShippingRate = {
  name: string;
  amountCents: number;
};

export const shippingRates: ShippingRate[] = [
  { name: "USPS Ground", amountCents: 695 },
  { name: "USPS Priority", amountCents: 1295 },
];
