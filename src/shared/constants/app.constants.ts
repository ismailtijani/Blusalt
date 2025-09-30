import { SetMetadata } from '@nestjs/common';
import { DroneModel, DroneStatus } from '../enums/enum';

// Security
export const SENSITIVE_FIELDS = [
  'password',
  'token',
  'authorization',
  'accessToken',
  'refreshToken',
] as const;
export const SALT_ROUNDS = 10;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

// Drone Constants
export const MAX_DRONE_WEIGHT = 500; // grams
export const MIN_BATTERY_LEVEL_FOR_LOADING = 25; // percentage
export const MIN_BATTERY_LEVEL_FOR_DELIVERY = 30; // percentage
export const CRITICAL_BATTERY_LEVEL = 15; // percentage
export const DEFAULT_DRONE_SPEED = 60; // km/h
export const MAX_FLIGHT_TIME = 120; // minutes
export const MAINTENANCE_INTERVAL_HOURS = 100; // hours

// Delivery Constants
export const MAX_DELIVERY_DISTANCE = 100; // km
export const DELIVERY_TIMEOUT_MINUTES = 180; // minutes
export const EMERGENCY_DELIVERY_PRIORITY = 1000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Rate Limiting
export const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms
export const RATE_LIMIT_MAX_REQUESTS = 100;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

// Coordinates Precision
export const COORDINATE_DECIMAL_PLACES = 6;

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const DRONE_WEIGHT_LIMITS: Record<DroneModel, number> = {
  [DroneModel.LIGHTWEIGHT]: 125,
  [DroneModel.MIDDLEWEIGHT]: 250,
  [DroneModel.CRUISERWEIGHT]: 375,
  [DroneModel.HEAVYWEIGHT]: 500,
};

// Valid state transitions for drones
export const VALID_STATE_TRANSITIONS: Record<DroneStatus, DroneStatus[]> = {
  [DroneStatus.IDLE]: [DroneStatus.LOADING, DroneStatus.MAINTENANCE],
  [DroneStatus.LOADING]: [DroneStatus.LOADED, DroneStatus.IDLE],
  [DroneStatus.LOADED]: [DroneStatus.DELIVERING, DroneStatus.IDLE],
  [DroneStatus.DELIVERING]: [DroneStatus.DELIVERED, DroneStatus.RETURNING],
  [DroneStatus.DELIVERED]: [DroneStatus.RETURNING],
  [DroneStatus.RETURNING]: [DroneStatus.IDLE],
  [DroneStatus.MAINTENANCE]: [DroneStatus.IDLE],
};
