export function formatCurrency(cents, currency = 'BRL', locale = 'pt-BR') {
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
    }
    catch {
        const symbol = currency === 'BRL' ? 'R$' : '$';
        return `${symbol}${(cents / 100).toFixed(2)}`;
    }
}
export function formatDateShort(d) {
    try {
        return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(d);
    }
    catch {
        return d.toDateString();
    }
}
