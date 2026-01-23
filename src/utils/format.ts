export function formatWon(amount: number): string {
    if (amount >= 10000) {
        const man = amount / 10000;
        return man % 1 === 0 ? `${man} 만원` : `${man.toFixed(1)} 만원`;
    }
    return `${amount.toLocaleString()} 원`;
}
