export function stringToHSLColor(str: string): string {
    if (!str) return '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360; // Ensure hue is within 0-359
    return `hsl(${hue}, 100%, 84%)`;
}
