export enum ErrorMessages {
  // Generic Error Messages
  ENTITY_NOT_FOUND = 'The requested resource was not found',
  VALIDATION_ERROR = 'Validation failed',
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Forbidden resource',
  BAD_REQUEST = 'Bad Request',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  DATABASE_ERROR = 'Database error occurred',
  RESOURCE_NOT_FOUND = 'Resource not found',
  TOKEN_ERROR = 'Invalid or Expired Token',
  INVALID_AUTH_TOKEN_ERROR = 'Invalid Authorization token',
  REFRESH_TOKEN_EXPIRED = 'Refresh token has expired',
  SESSION_EXPIRED = 'Session has expired',

  // User Error Messages
  USER_NOT_FOUND = 'User not found',
  USER_ALREADY_EXISTS = 'User already exists',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  PHONE_ALREADY_EXISTS = 'Phone number already exists',
  INVALID_CREDENTIALS = 'Invalid email or password',
  ACCOUNT_DISABLED = 'Account has been disabled',
  ACCOUNT_NOT_VERIFIED = 'Account not verified',
  PASSWORD_RESET_TOKEN_INVALID = 'Password reset token is invalid or expired',
  USER_CREATE_FAILED = 'Failed to create user',
  USER_UPDATE_FAILED = 'Failed to update user',
  USER_DELETE_FAILED = 'Failed to delete user',

  // Drone Error Messages
  DRONE_NOT_FOUND = 'Drone not found',
  DRONE_CREATE_FAILED = 'Failed to create drone',
  DRONE_UPDATE_FAILED = 'Failed to update drone',
  DRONE_DELETE_FAILED = 'Failed to delete drone',
  DRONE_ALREADY_EXISTS = 'Drone with this serial number already exists',
  DRONE_NOT_AVAILABLE = 'Drone is not available for loading',
  DRONE_BATTERY_LOW = 'Drone battery level is below minimum requirement',
  DRONE_WEIGHT_EXCEEDED = 'Weight limit exceeded for this drone',
  DRONE_INVALID_STATE = 'Invalid drone state transition',
  DRONE_IN_MAINTENANCE = 'Drone is currently in maintenance',
  DRONE_ALREADY_LOADED = 'Drone is already loaded with items',
  DRONE_NO_ITEMS_LOADED = 'No items loaded on this drone',
  DRONE_OVERLOAD = 'Drone cannot carry more than its weight limit',
  DRONE_LOW_BATTERY = 'Drone battery level is below 25% - cannot enter LOADING state',
  DRONE_INACTIVE = 'Drone is not active',

  // Medication Error Messages
  MEDICATION_NOT_FOUND = 'Medication not found',
  MEDICATION_ALREADY_EXISTS = 'Medication with this code already exists',
  MEDICATION_CREATE_FAILED = 'Failed to create medication',
  MEDICATION_UPDATE_FAILED = 'Failed to update medication',
  MEDICATION_DELETE_FAILED = 'Failed to delete medication',
  INVALID_MEDICATION_NAME = 'Medication name contains invalid characters',
  INVALID_MEDICATION_CODE = 'Medication code contains invalid characters',

  // Delivery Error Messages
  DELIVERY_NOT_FOUND = 'Delivery request not found',
  DELIVERY_ALREADY_ASSIGNED = 'Delivery already assigned to a drone',
  DELIVERY_CANNOT_BE_CANCELLED = 'Delivery cannot be cancelled at this stage',
  INVALID_PICKUP_LOCATION = 'Invalid pickup location',
  INVALID_DESTINATION_LOCATION = 'Invalid destination location',
  NO_DRONES_AVAILABLE = 'No drones available for delivery',
  DELIVERY_ALREADY_COMPLETED = 'Delivery has already been completed',
  DELIVERY_CREATE_FAILED = 'Failed to create delivery request',
  DELIVERY_UPDATE_FAILED = 'Failed to update delivery request',
  DELIVERY_DELETE_FAILED = 'Failed to delete delivery request',
  DELIVERY_INVALID_STATUS = 'Invalid delivery status transition',

  // Audit Error Messages
  AUDIT_LOG_CREATE_FAILED = 'Failed to create audit log entry',
  AUDIT_LOG_NOT_FOUND = 'Audit log entry not found',

  // Permission Error Messages
  INSUFFICIENT_PERMISSIONS = 'Insufficient permissions to perform this action',
  ROLE_NOT_FOUND = 'Role not found',
  PERMISSION_DENIED = 'Permission denied',

  // File Error Messages
  FILE_NOT_FOUND = 'File not found',
  FILE_UPLOAD_FAILED = 'File upload failed',
  INVALID_FILE_TYPE = 'Invalid file type',
  FILE_SIZE_EXCEEDED = 'File size exceeded',
}
