import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        // If it's a SuccessResponse with nested data
        if (response && response.data) {
          // If data has nested data array (pagination case)
          if (response.data.data && Array.isArray(response.data.data)) {
            return {
              ...response,
              data: {
                ...response.data,
                data: this.transformData(response.data.data),
              },
            };
          }
          // If data is direct array
          else if (Array.isArray(response.data)) {
            return {
              ...response,
              data: this.transformData(response.data),
            };
          }
          // If data is single object
          else if (typeof response.data === 'object') {
            return {
              ...response,
              data: this.transformData(response.data),
            };
          }
        }

        // If no wrapper, transform directly
        return this.transformData(response);
      }),
    );
  }

  private transformData(data: any) {
    return plainToInstance(this.dto, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
