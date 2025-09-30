interface OrderLine {
  id: string;
  externalRef: string | null;
}

export const findIssues = (lines: OrderLine[]) =>
  lines.filter((line) => !line.externalRef || !line.externalRef.includes('HS')).map((line) => line.id);
