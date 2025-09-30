import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SENSITIVE_FIELDS } from '../constants/app.constants';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, query, body } = request;
    const timestamp = new Date().toISOString();

    const reqLogData = {
      method,
      url,
      time: timestamp,
      body: JSON.stringify(this.sanitizeBody(body)),
      query: JSON.stringify(query),
    };
    console.log('================= REQUEST ==================');
    console.log(reqLogData);
    console.log('================= REQUEST ==================');
    return next.handle().pipe(
      tap((res) => {
        const resLogData = {
          method,
          url,
          time: timestamp,
          body: JSON.stringify(this.sanitizeBody(res.data)),
        };
        console.log('================= RESPONSE ==================');
        console.log(resLogData);
        console.log('================= RESPONSE ==================');
        Logger.log(
          `${method} ${url} ${Date.now() - Date.now()}ms`,
          context.getClass().name,
        );
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };

    SENSITIVE_FIELDS.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '********';
      }
    });

    return sanitized;
  }
}
