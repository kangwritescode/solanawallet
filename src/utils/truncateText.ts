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