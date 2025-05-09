export const Department = {
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  SALES: 'SALES',
  FINANCE: 'FINANCE',
  HR: 'HUMAN RESOURCE',
  MARKETING: 'MARKETING',
  IT: 'INFORMATION TECHNOLOGY',
  PRODUCTION: 'PRODUCTION',
  LEGAL: 'LEGAL',
  SUPPORT: 'SUPPORT',
  LOGISTICS: 'LOGISTICS',
  RESEARCH_AND_DEVELOPMENT: 'RESEARCH_AND_DEVELOPMENT',
  SUSTAINABILITY: 'SUSTAINABILITY',
} as const;

export type Department = keyof typeof Department;
