export const InterestStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  APPROVED: 'approved',
} as const;

export type InterestStatus = keyof typeof InterestStatus;
