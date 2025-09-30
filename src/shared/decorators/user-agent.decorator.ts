import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'UNKNOWN';
  },
);
