export class ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  timestamp: string;
  statusCode?: number;

  constructor(message: string, error?: string, statusCode?: number) {
    this.success = false;
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
