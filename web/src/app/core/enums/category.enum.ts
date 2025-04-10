export const Category = {
  ELECTRONIC: 'ELECTRONIC',
  PLASTIC: 'PLASTIC',
  METAL: 'METAL',
  TEXTILE: 'TEXTILE',
  WOOD: 'WOOD',
  GLASS: 'GLASS',
  FOOD: 'FOOD',
  CHEMICAL: 'CHEMICAL',
} as const;

export type Category = keyof typeof Category;
