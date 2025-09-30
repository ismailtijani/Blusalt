import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Drone } from '../drones/entities/drone.entity';
import { MIN_BATTERY_LEVEL_FOR_LOADING } from 'src/shared';

/**
 * Battery Check Service
 * Handles periodic drone battery monitoring
 * Emits activity logs for tracking
 */
@Injectable()
export class BatteryCheckService {
  private readonly logger = new Logger(BatteryCheckService.name);

  constructor(
    @InjectRepository(Drone)
    private readonly droneRepository: Repository<Drone>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Periodic task to check all drone battery levels
   * Runs every 10 minutes as per requirements
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkDroneBatteryLevels(): Promise<void> {
    this.logger.log('Starting periodic battery level check');

    try {
      const drones = await this.droneRepository.find({
        where: { isActive: true },
        select: ['id', 'serialNumber', 'batteryCapacity', 'status', 'model'],
      });

      this.logger.log(`Checking battery levels for ${drones.length} drones`);

      const lowBatteryDrones: any[] = [];
      const checkResults: any[] = [];

      for (const drone of drones) {
        const isLowBattery =
          drone.batteryCapacity < MIN_BATTERY_LEVEL_FOR_LOADING;

        const checkResult = {
          droneId: drone.id,
          serialNumber: drone.serialNumber,
          batteryLevel: drone.batteryCapacity,
          status: drone.status,
          isLowBattery,
        };

        checkResults.push(checkResult);

        if (isLowBattery) {
          lowBatteryDrones.push(checkResult);
          this.logger.warn(
            `Low battery detected - Drone: ${drone.serialNumber}, Battery: ${drone.batteryCapacity}%`,
          );
        }
      }

      // Emit activity log for the battery check operation
      this.eventEmitter.emit('onUserActivity', {
        action: 'BATTERY_CHECK',
        description: `Periodic battery check completed - ${drones.length} drones checked, ${lowBatteryDrones.length} with low battery`,
        feedback: {
          totalDrones: drones.length,
          lowBatteryCount: lowBatteryDrones.length,
          lowBatteryDrones: lowBatteryDrones.map((d) => ({
            serialNumber: d.serialNumber as string,
            batteryLevel: d.batteryLevel as number,
          })),
          checkResults: checkResults,
        },
        identity: 'SYSTEM',
        maskedAction: false,
        maskedFeedback: false,
        what: '/system/battery-check',
        when: new Date(),
        owner: 'SYSTEM',
      });

      this.logger.log(
        `Battery check completed - Total: ${drones.length}, Low Battery: ${lowBatteryDrones.length}`,
      );
    } catch (error) {
      this.logger.error(
        'Error during battery level check',
        (error as Error).stack,
      );

      // Log the error as an activity
      this.eventEmitter.emit('onUserActivity', {
        action: 'BATTERY_CHECK_ERROR',
        description: 'Battery check task failed',
        feedback: { error: (error as Error).message },
        identity: 'SYSTEM',
        maskedAction: false,
        maskedFeedback: false,
        what: '/system/battery-check',
        when: new Date(),
        owner: 'SYSTEM',
      });
    }
  }

  /**
   * Manual battery check for specific drone
   */
  async checkSingleDroneBattery(
    droneId: string,
    userId: string,
    userIdentity: string,
  ): Promise<void> {
    this.logger.log(`Manual battery check for drone: ${droneId}`);

    const drone = await this.droneRepository.findOne({
      where: { id: droneId },
    });

    if (!drone) {
      this.logger.warn(`Drone not found for battery check: ${droneId}`);
      return;
    }

    const isLowBattery = drone.batteryCapacity < MIN_BATTERY_LEVEL_FOR_LOADING;

    // Emit activity log for manual check
    this.eventEmitter.emit('onUserActivity', {
      action: 'MANUAL_BATTERY_CHECK',
      description: `Manual battery check for drone ${drone.serialNumber}`,
      actionData: { droneId: drone.id, serialNumber: drone.serialNumber },
      feedback: {
        batteryCapacity: drone.batteryCapacity,
        isLowBattery,
        status: drone.status,
      },
      identity: userIdentity,
      maskedAction: false,
      maskedFeedback: false,
      what: `/drones/${droneId}/battery`,
      when: new Date(),
      owner: userId,
    });
  }
}
