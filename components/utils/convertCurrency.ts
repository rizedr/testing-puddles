const formatUnits = (value: bigint, decimals: number) => {
    let display = value.toString();

    const negative = display.startsWith('-');
    if (negative) display = display.slice(1);

    display = display.padStart(decimals, '0');

    let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals),
    ];
    fraction = fraction.replace(/(0+)$/, '');
    return `${negative ? '-' : ''}${integer || '0'}${
        fraction ? `.${fraction}` : ''
    }`;
};

export const convertCurrency = (value: number): bigint => {
    if (isNaN(value)) {
        return BigInt(0);
    }

    // Convert to cents first to avoid floating point issues
    const cents = Math.round(value * 100);
    // Convert cents to wei (1 ether = 100 cents in this case)
    const wei = BigInt(cents) * BigInt(10 ** 16);
    // Round to the nearest 1000 wei to eliminate small discrepancies
    return (wei / BigInt(1000)) * BigInt(1000);
};

export const convertCurrencyToDisplay = (value: bigint | undefined): string => {
    if (!value) return '0.00';
    const result = Number(formatUnits(value, 6)).toFixed(2);
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const convertPNLCurrencyToDisplay = (
    buy_in: bigint,
    cash_out: bigint,
): string => {
    const pnl = cash_out - buy_in;
    if (pnl < 0) {
        return `-$${convertCurrencyToDisplay(pnl).slice(1)}`;
    }
    const displayValue = convertCurrencyToDisplay(pnl);
    return displayValue === '0.00' ? `$${displayValue}` : `+$${displayValue}`;
};
