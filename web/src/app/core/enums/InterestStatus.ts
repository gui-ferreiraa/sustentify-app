export const InterestStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type InterestStatus = keyof typeof InterestStatus;
