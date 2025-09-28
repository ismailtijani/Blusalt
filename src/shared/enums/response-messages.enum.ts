export enum ResponseMessages {
  // Generic Response Messages
  OPERATION_SUCCESSFUL = 'Operation completed successfully',
  DATA_RETRIEVED = 'Data retrieved successfully',
  DATA_CREATED = 'Data created successfully',
  DATA_UPDATED = 'Data updated successfully',
  DATA_DELETED = 'Data deleted successfully',
  BULK_OPERATION_SUCCESSFUL = 'Bulk operation completed successfully',

  // User Response Messages
  USER_CREATED = 'User created successfully',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',
  USER_RETRIEVED = 'User retrieved successfully',
  USERS_RETRIEVED = 'Users retrieved successfully',
  PASSWORD_CHANGED = 'Password changed successfully',
  PASSWORD_RESET_EMAIL_SENT = 'Password reset email sent successfully',
  ACCOUNT_VERIFIED = 'Account verified successfully',
  PROFILE_UPDATED = 'Profile updated successfully',

  // Auth Response Messages
  LOGIN_SUCCESSFUL = 'Login successful',
  LOGOUT_SUCCESSFUL = 'Logout successful',
  TOKEN_REFRESHED = 'Token refreshed successfully',
  VERIFICATION_EMAIL_SENT = 'Verification email sent',

  // Drone Response Messages
  DRONE_REGISTERED = 'Drone registered successfully',
  DRONE_UPDATED = 'Drone updated successfully',
  DRONE_DELETED = 'Drone deleted successfully',
  DRONE_RETRIEVED = 'Drone retrieved successfully',
  DRONES_RETRIEVED = 'Drones retrieved successfully',
  DRONE_LOADED = 'Drone loaded successfully',
  DRONE_STATE_UPDATED = 'Drone state updated successfully',
  DRONE_MAINTENANCE_SCHEDULED = 'Drone maintenance scheduled',
  BATTERY_STATUS_RETRIEVED = 'Battery status retrieved successfully',
  AVAILABLE_DRONES_RETRIEVED = 'Available drones retrieved successfully',

  // Medication Response Messages
  MEDICATION_CREATED = 'Medication created successfully',
  MEDICATION_UPDATED = 'Medication updated successfully',
  MEDICATION_DELETED = 'Medication deleted successfully',
  MEDICATION_RETRIEVED = 'Medication retrieved successfully',
  MEDICATIONS_RETRIEVED = 'Medications retrieved successfully',
  LOADED_ITEMS_RETRIEVED = 'Loaded items retrieved successfully',

  // Delivery Response Messages
  DELIVERY_CREATED = 'Delivery request created successfully',
  DELIVERY_ASSIGNED = 'Delivery assigned to drone successfully',
  DELIVERY_STARTED = 'Delivery started successfully',
  DELIVERY_COMPLETED = 'Delivery completed successfully',
  DELIVERY_CANCELLED = 'Delivery cancelled successfully',
  DELIVERY_RETRIEVED = 'Delivery retrieved successfully',
  DELIVERIES_RETRIEVED = 'Deliveries retrieved successfully',

  // Notification Response Messages
  NOTIFICATION_SENT = 'Notification sent successfully',
  NOTIFICATIONS_RETRIEVED = 'Notifications retrieved successfully',
  NOTIFICATION_MARKED_READ = 'Notification marked as read',

  // Audit Response Messages
  AUDIT_LOGS_RETRIEVED = 'Audit logs retrieved successfully',
  AUDIT_LOG_CREATED = 'Audit log created successfully',
}
