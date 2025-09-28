import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DeliveryRequest } from './delivery-request.entity';
import { Medication } from '../../medications/entities/medication.entity';
import { BaseEntity } from 'src/shared';

@Entity('delivery_request_items')
export class DeliveryRequestItem extends BaseEntity {
  @Column({ name: 'delivery_request_id' })
  deliveryRequestId: string;

  @Column({ name: 'medication_id' })
  medicationId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  totalWeight: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(
    () => DeliveryRequest,
    (deliveryRequest) => deliveryRequest.items,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'delivery_request_id' })
  deliveryRequest: DeliveryRequest;

  @ManyToOne(() => Medication, (medication) => medication.deliveryRequestItems)
  @JoinColumn({ name: 'medication_id' })
  medication: Medication;
}
