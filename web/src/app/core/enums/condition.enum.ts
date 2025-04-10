export const Condition = {
  NEW: 'NEW',
  USED: 'USED',
  REFURBISHED: 'REFURBISHED',
  DAMAGED: 'DAMAGED',
  EXPIRED: 'EXPIRED',
  AVAILABLE: 'AVAILABLE',
} as const;

export type Condition = keyof typeof Condition;
