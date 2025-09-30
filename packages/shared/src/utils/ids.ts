import crypto from 'node:crypto';

export const createId = () => crypto.randomUUID();

export const withCorrelationId = (correlationId?: string) =>
  correlationId ?? createId();
