import { z } from 'zod';
import { AlertSeverity, AlertStatus, OrderStatus, PegReason, ShipmentStatus } from '../domain/status';

export const baseEvent = z.object({
  id: z.string(),
  type: z.string(),
  occurredAt: z.string(),
  source: z.string(),
  correlationId: z.string().optional()
});

export const orderIngestedEvent = baseEvent.extend({
  type: z.literal('order.ingested'),
  payload: z.object({
    orderId: z.string(),
    externalRef: z.string().nullable(),
    status: z.nativeEnum(OrderStatus)
  })
});

export const shipmentEvent = baseEvent.extend({
  type: z.literal('shipment.event'),
  payload: z.object({
    shipmentId: z.string(),
    status: z.nativeEnum(ShipmentStatus),
    location: z.string().nullable(),
    eta: z.string().nullable()
  })
});

export const alertRaisedEvent = baseEvent.extend({
  type: z.literal('alert.raised'),
  payload: z.object({
    alertId: z.string(),
    severity: z.nativeEnum(AlertSeverity),
    status: z.nativeEnum(AlertStatus)
  })
});

export const pegAllocationEvent = baseEvent.extend({
  type: z.literal('peg.allocated'),
  payload: z.object({
    allocationId: z.string(),
    ruleId: z.string(),
    reasons: z.array(z.nativeEnum(PegReason)),
    orderLineId: z.string(),
    inventoryId: z.string(),
    quantity: z.number()
  })
});

export type DomainEvent =
  | z.infer<typeof orderIngestedEvent>
  | z.infer<typeof shipmentEvent>
  | z.infer<typeof alertRaisedEvent>
  | z.infer<typeof pegAllocationEvent>;

export const domainEventSchema = z.discriminatedUnion('type', [
  orderIngestedEvent,
  shipmentEvent,
  alertRaisedEvent,
  pegAllocationEvent
]);
