export function formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) return typeof amount === 'string' ? amount : '$0.00';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num) + ' USD';
}
