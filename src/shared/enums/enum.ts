export enum DroneModel {
  LIGHTWEIGHT = 'Lightweight',
  MIDDLEWEIGHT = 'Middleweight',
  CRUISERWEIGHT = 'Cruiserweight',
  HEAVYWEIGHT = 'Heavyweight',
}

export enum DroneState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING',
  MAINTENANCE = 'MAINTENANCE',
}

export enum MedicationType {
  MEDICATION = 'MEDICATION',
  MEDICAL_SUPPLIES = 'MEDICAL_SUPPLIES',
  OTHER = 'OTHER',
}

export enum DeliveryPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
}

export enum UserType {
  HOSPITAL = 'HOSPITAL',
  PHARMACY = 'PHARMACY',
  MEDICAL_CENTER = 'MEDICAL_CENTER',
  INDIVIDUAL = 'INDIVIDUAL',
}
