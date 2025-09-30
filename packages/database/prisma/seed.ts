import { PrismaClient, OrderStatus, AlertSeverity, AlertStatus, ShipmentStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { loadPlaybooks } from '../../playbooks/src';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.alertAudit.deleteMany();
    await tx.alert.deleteMany();
    await tx.action.deleteMany();
    await tx.playbook.deleteMany();
    await tx.kPIReading.deleteMany();
    await tx.shipmentEvent.deleteMany();
    await tx.shipment.deleteMany();
    await tx.pegAllocation.deleteMany();
    await tx.orderLine.deleteMany();
    await tx.order.deleteMany();
    await tx.inventory.deleteMany();
    await tx.customer.deleteMany();
    await tx.facility.deleteMany();
    await tx.market.deleteMany();
    await tx.supplier.deleteMany();
    await tx.carrier.deleteMany();
    await tx.user.deleteMany();
    await tx.role.deleteMany();
  });

  const sacRole = await prisma.role.create({
    data: { code: 'SAC', name: 'Service Account Coordinator' }
  });
  const snsRole = await prisma.role.create({ data: { code: 'SUPPLY_NETWORK_SPECIALIST', name: 'Supply Network Specialist' } });
  const dcRole = await prisma.role.create({ data: { code: 'DC', name: 'Distribution Centre Ops' } });
  await prisma.role.create({ data: { code: 'CUSTOMER', name: 'Customer' } });
  await prisma.role.create({ data: { code: 'ADMIN', name: 'Administrator' } });

  const sacUser = await prisma.user.create({
    data: { email: 'sac@example.com', name: 'SAC Operator', roleId: sacRole.id }
  });
  const snsUser = await prisma.user.create({
    data: { email: 'sns@example.com', name: 'Supply Specialist', roleId: snsRole.id }
  });
  const dcUser = await prisma.user.create({
    data: { email: 'dc@example.com', name: 'DC Operator', roleId: dcRole.id }
  });

  const market = await prisma.market.create({ data: { code: 'EU', name: 'Europe' } });
  const facility = await prisma.facility.create({ data: { code: 'AMS-DC', name: 'Amsterdam DC', type: 'DC', marketId: market.id } });
  const facilityB = await prisma.facility.create({ data: { code: 'FRA-HUB', name: 'Frankfurt Hub', type: 'HUB', marketId: market.id } });

  const customerVip = await prisma.customer.create({
    data: { name: 'AeroPower Airlines', marketId: market.id, externalRef: 'CUST1001' }
  });
  const customerStandard = await prisma.customer.create({
    data: { name: 'Regional Maintenance Co', marketId: market.id, externalRef: 'CUST2002' }
  });

  const supplier = await prisma.supplier.create({ data: { name: 'TurbineWorks GmbH', externalRef: 'SUP5001' } });
  const carrierA = await prisma.carrier.create({ data: { name: 'SkyFreight', mode: 'AIR' } });
  const carrierB = await prisma.carrier.create({ data: { name: 'GreenWings', mode: 'AIR' } });

  const inventoryBatch = await prisma.inventory.create({
    data: {
      facilityId: facility.id,
      supplierId: supplier.id,
      sku: 'TB-9001',
      description: 'Turbine Blade',
      quantity: 10,
      safetyStock: 4,
      externalRef: 'INV-1001'
    }
  });

  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: customerVip.id,
        supplierId: supplier.id,
        status: OrderStatus.CONFIRMED,
        externalRef: 'SAP-4500001',
        confirmationNumber: 'OC-1001',
        orderLines: {
          create: [
            {
              sku: 'TB-9001',
              description: 'Turbine Blade',
              quantity: 6,
              requiredDate: dayjs().add(2, 'day').toDate(),
              externalRef: 'OL-1'
            }
          ]
        }
      },
      include: { orderLines: true }
    }),
    prisma.order.create({
      data: {
        customerId: customerStandard.id,
        supplierId: supplier.id,
        status: OrderStatus.CONFIRMED,
        externalRef: 'SAP-4500002',
        confirmationNumber: 'OC-1002',
        orderLines: {
          create: [
            {
              sku: 'TB-9001',
              description: 'Turbine Blade',
              quantity: 6,
              requiredDate: dayjs().add(4, 'day').toDate(),
              externalRef: 'OL-2'
            }
          ]
        }
      },
      include: { orderLines: true }
    })
  ]);

  await prisma.pegAllocation.create({
    data: {
      orderLineId: orders[0].orderLines[0].id,
      inventoryId: inventoryBatch.id,
      quantity: 6,
      ruleId: 'contract-tier-priority',
      reasons: 'CONTRACT_TIER,CRITICALITY',
      impactNotes: 'Allocated to VIP customer due to aircraft-on-ground event'
    }
  });

  await prisma.pegAllocation.create({
    data: {
      orderLineId: orders[1].orderLines[0].id,
      inventoryId: inventoryBatch.id,
      quantity: 4,
      ruleId: 'fairness-guardrail',
      reasons: 'FAIRNESS',
      impactNotes: 'Residual inventory held for fairness guardrail'
    }
  });

  const shipment = await prisma.shipment.create({
    data: {
      orderId: orders[0].id,
      carrierId: carrierA.id,
      facilityId: facility.id,
      status: ShipmentStatus.IN_TRANSIT,
      eta: dayjs().add(1, 'day').toDate(),
      externalRef: 'SH-5001'
    }
  });

  await prisma.shipmentEvent.createMany({
    data: [
      {
        shipmentId: shipment.id,
        status: ShipmentStatus.CREATED,
        occurredAt: dayjs().subtract(1, 'day').toDate(),
        location: facility.name
      },
      {
        shipmentId: shipment.id,
        status: ShipmentStatus.IN_TRANSIT,
        occurredAt: dayjs().subtract(6, 'hour').toDate(),
        location: 'Frankfurt Hub'
      }
    ]
  });

  const playbookRecords = loadPlaybooks().map((playbook) => ({
    code: playbook.id,
    name: playbook.name,
    summary: playbook.steps.map((step) => step.description).join('; ')
  }));
  await prisma.playbook.createMany({ data: playbookRecords });

  await prisma.alert.create({
    data: {
      orderId: orders[1].id,
      ownerId: snsUser.id,
      status: AlertStatus.OPEN,
      severity: AlertSeverity.HIGH,
      type: 'Inventory',
      description: 'Stock shortage detected for TB-9001',
      playbookId: 'stock-shortage-reallocate',
      resolutionDue: dayjs().add(6, 'hour').toDate()
    }
  });

  await prisma.alert.create({
    data: {
      orderId: orders[0].id,
      ownerId: sacUser.id,
      status: AlertStatus.OPEN,
      severity: AlertSeverity.CRITICAL,
      type: 'ExternalRisk',
      description: 'Carrier strike impacting route via FRA',
      playbookId: 'carrier-strike-switch',
      resolutionDue: dayjs().add(2, 'hour').toDate()
    }
  });

  await prisma.masterDataIssue.create({
    data: {
      entityType: 'OrderLine',
      entityId: orders[1].orderLines[0].id,
      field: 'HS_CODE',
      description: 'Missing HS code for customs clearance',
      ownerId: dcUser.id,
      slaDue: dayjs().add(1, 'day').toDate()
    }
  });

  await prisma.kPIReading.createMany({
    data: [
      { name: 'CWOTD', value: 0.92, weight: 0.5 },
      { name: 'Backlog Aging', value: 12, weight: 0.3 },
      { name: 'On-Time Readiness', value: 0.87, weight: 0.2 }
    ]
  });

  await prisma.whatIfScenario.create({
    data: {
      name: 'Reroute via DC-B',
      parameters: {
        route: 'AMS-DC -> FRA-HUB -> JFK',
        safetyStockDelta: 3,
        sourcingSplit: 0.7,
        carrier: carrierB.name,
        dcBypass: false,
        expedite: true
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
