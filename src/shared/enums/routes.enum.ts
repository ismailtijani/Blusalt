export enum Routes {
  // Auth Routes
  LOGIN = 'login',
  SIGNUP = 'signup',
  LOGOUT = 'logout',
  REFRESH_TOKEN = 'refresh-token',
  VERIFY = 'verify',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  CHANGE_PASSWORD = 'change-password',

  // User Routes
  CREATE_USER = '',
  GET_USERS = '',
  UPDATE_USER = ':id',
  DELETE_USER = ':id',
  GET_ONE_USER = ':id',
  GET_USER_PROFILE = 'profile',
  UPDATE_USER_PROFILE = 'profile',
  BULK_DELETE_USERS = 'bulk-delete',

  // Drone Routes
  REGISTER_DRONE = 'register',
  GET_DRONES = '',
  GET_ONE_DRONE = ':droneId',
  UPDATE_DRONE = ':droneId',
  DELETE_DRONE = ':droneId',
  LOAD_DRONE = ':droneId/load',
  GET_DRONE_MEDICATIONS = ':droneId/medications',
  GET_AVAILABLE_DRONES = 'available',
  GET_DRONE_BATTERY = ':droneId/battery',
  UPDATE_DRONE_STATE = ':droneId/state',
  SCHEDULE_MAINTENANCE = ':droneId/maintenance',
  CHECK_DRONE_BATTERY = ':droneId/battery-status',
  UPDATE_DRONE_LOCATION = ':droneId/location',

  // Medication Routes
  CREATE_MEDICATION = '',
  GET_MEDICATIONS = '',
  GET_ONE_MEDICATION = ':medicationId',
  UPDATE_MEDICATION = ':medicationId',
  DELETE_MEDICATION = ':medicationId',
  UPLOAD_MEDICATION_IMAGE = ':medicationId/image',

  // Delivery Routes
  CREATE_DELIVERY = '',
  GET_DELIVERIES = '',
  GET_ONE_DELIVERY = ':id',
  UPDATE_DELIVERY = ':id',
  CANCEL_DELIVERY = ':id/cancel',
  ASSIGN_DELIVERY = ':id/assign',
  START_DELIVERY = ':id/start',
  COMPLETE_DELIVERY = ':id/complete',
  TRACK_DELIVERY = ':id/track',

  // Notification Routes
  GET_NOTIFICATIONS = '',
  MARK_NOTIFICATION_READ = ':id/read',
  MARK_ALL_READ = 'mark-all-read',
  DELETE_NOTIFICATION = ':id',

  // Audit Routes
  GET_AUDIT_LOGS = '',
  EXPORT_AUDIT_LOGS = 'export',

  // Dashboard Routes
  GET_DASHBOARD_STATS = 'stats',
  GET_DELIVERY_ANALYTICS = 'analytics/deliveries',
  GET_DRONE_ANALYTICS = 'analytics/drones',
  GET_PERFORMANCE_METRICS = 'analytics/performance',

  // Health Routes
  HEALTH_CHECK = 'health',
  READINESS_CHECK = 'ready',
  LIVENESS_CHECK = 'live',
}
