import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditLog } from './entities/audit-log.entity';
import { BaseService, UserActivityLogData } from 'src/shared';

@Injectable()
export class AuditLogService extends BaseService<AuditLog> {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  @OnEvent('onUserActivity')
  async handleUserActivity(logData: UserActivityLogData): Promise<void> {
    try {
      await this.logActivity(logData);
    } catch (error) {
      this.logger.error('Failed to log user activity', (error as Error).stack);
    }
  }

  async logActivity(logData: UserActivityLogData): Promise<AuditLog> {
    const auditLog = await this.create({
      action: this.extractActionName(logData.action, logData.description),
      description: logData.description,
      actionData: this.sanitizeData(
        logData.action,
        logData.maskedAction || false,
      ),
      feedback: this.sanitizeData(
        logData.feedback,
        logData.maskedFeedback || false,
      ),
      identity: logData.identity,
      maskedAction: logData.maskedAction || false,
      maskedFeedback: logData.maskedFeedback || false,
      what: logData.what,
      when:
        typeof logData.when === 'string'
          ? new Date(logData.when)
          : logData.when,
      owner: logData.owner,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
    } as Partial<AuditLog>);

    this.logger.log(
      `Activity logged: ${logData.description} by ${logData.identity}`,
    );
    return auditLog;
  }

  async findActivityLogs(filters: {
    owner?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { owner, action, startDate, endDate, page = 1, limit = 50 } = filters;

    const query = this.repository.createQueryBuilder('audit');

    if (owner) {
      query.andWhere('audit.owner = :owner', { owner });
    }

    if (action) {
      query.andWhere('audit.action ILIKE :action', { action: `%${action}%` });
    }

    if (startDate) {
      query.andWhere('audit.when >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('audit.when <= :endDate', { endDate });
    }

    query.orderBy('audit.when', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getUserActivityHistory(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.repository.find({
      where: {
        owner: userId,
      },
      order: {
        when: 'DESC',
      },
      take: 100,
    });
  }

  private extractActionName(action: unknown, description: string): string {
    if (typeof action === 'string') {
      return action;
    }

    // Extract from description or create a slug
    return description
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .substring(0, 100);
  }

  private sanitizeData(data: unknown, isMasked: boolean): unknown {
    if (!data) {
      return null;
    }

    if (isMasked) {
      return { _masked: true, message: 'Sensitive data redacted' };
    }

    // Convert to plain object if needed
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...(data as Record<string, unknown>) };

      // Remove sensitive fields
      const sensitiveFields = [
        'password',
        'currentPassword',
        'newPassword',
        'confirmPassword',
        'token',
        'refreshToken',
        'accessToken',
        'secret',
        'apiKey',
        'buffer',
        'mimetype',
        'stream',
      ];

      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '****[REDACTED]*****';
        }
      }

      if (sanitized.fieldname && sanitized.originalname) {
        return {
          filename: sanitized.originalname,
          size: sanitized.size,
          mimetype: sanitized.mimetype,
        };
      }

      return sanitized;
    }

    return data;
  }

  protected getCreateErrorMessage(): string {
    return 'Failed to create audit log';
  }

  protected getUpdateErrorMessage(): string {
    return 'Failed to update audit log';
  }

  protected getDeleteErrorMessage(): string {
    return 'Failed to delete audit log';
  }

  protected getNotFoundErrorMessage(): string {
    return 'Audit log not found';
  }
}
