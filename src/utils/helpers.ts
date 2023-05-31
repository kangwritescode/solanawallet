export const lamportToSolana = (lamport: string | number) => {
    return Number(lamport) / 1000000000;
}

export function truncateText(text: string | number, maxLength: number) {
    if (typeof text === 'number') {
        text = text.toString();
    }
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.substring(0, maxLength - 3) + '...';
    }
}

export const solantaToLamport = (solana: number) => {
    return solana * 1000000000;
}
