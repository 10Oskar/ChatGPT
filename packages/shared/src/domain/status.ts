export const OrderStatus = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  ALLOCATED: 'ALLOCATED',
  PICKING: 'PICKING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ShipmentStatus = {
  CREATED: 'CREATED',
  IN_TRANSIT: 'IN_TRANSIT',
  CUSTOMS: 'CUSTOMS',
  DELIVERED: 'DELIVERED',
  EXCEPTION: 'EXCEPTION'
} as const;
export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export const AlertStatus = {
  OPEN: 'OPEN',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  RESOLVED: 'RESOLVED'
} as const;
export type AlertStatus = (typeof AlertStatus)[keyof typeof AlertStatus];

export const AlertSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];

export const FacilityType = {
  DC: 'DC',
  HUB: 'HUB',
  DEPOT: 'DEPOT'
} as const;
export type FacilityType = (typeof FacilityType)[keyof typeof FacilityType];

export const RoleCode = {
  SAC: 'SAC',
  SUPPLY_NETWORK_SPECIALIST: 'SUPPLY_NETWORK_SPECIALIST',
  DC: 'DC',
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN'
} as const;
export type RoleCode = (typeof RoleCode)[keyof typeof RoleCode];

export const PegReason = {
  CONTRACT_TIER: 'CONTRACT_TIER',
  CRITICALITY: 'CRITICALITY',
  FAIRNESS: 'FAIRNESS',
  AGING: 'AGING',
  MANUAL_OVERRIDE: 'MANUAL_OVERRIDE'
} as const;
export type PegReason = (typeof PegReason)[keyof typeof PegReason];
