interface OrderInput {
  id: string;
  criticality: number;
  eta: Date;
}

export const sortSequence = (orders: OrderInput[]) =>
  [...orders].sort((a, b) => {
    if (a.criticality !== b.criticality) return b.criticality - a.criticality;
    return a.eta.getTime() - b.eta.getTime();
  });
