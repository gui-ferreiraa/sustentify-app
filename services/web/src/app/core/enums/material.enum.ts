export const Material = {
  PLASTIC: 'PLASTIC',
  METAL: 'METAL',
  GLASS: 'GLASS',
  WOOD: 'WOOD',
  PAPER: 'PAPER',
  RUBBER: 'RUBBER',
  FABRIC: 'FABRIC',
  CERAMIC: 'CERAMIC',
  COMPOSITE: 'COMPOSITE',
  OTHER: 'OTHER',
} as const;

export type Material = keyof typeof Material;
