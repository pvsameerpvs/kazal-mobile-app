export function formatCurrency(amount: string): string {
  return amount;
}

export function formatDate(date: string): string {
  return date;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
