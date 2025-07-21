// Material UI 700 color palette
const MATERIAL_700_COLORS = [
    '#D32F2F', // red
    '#C2185B', // pink
    '#7B1FA2', // purple
    '#512DA8', // deep purple
    '#303F9F', // indigo
    '#1976D2', // blue
    '#0288D1', // light blue
    '#0097A7', // cyan
    '#00796B', // teal
    '#388E3C', // green
    '#689F38', // light green
    '#AFB42B', // lime
    '#FBC02D', // yellow
    '#FFA000', // amber
    '#F57C00', // orange
    '#E64A19', // deep orange
];

export const stringToRouletteColor = (str: string): string => {
    const hash = str.split('').reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 12);

    const colorIndex = Math.abs(hash) % MATERIAL_700_COLORS.length;
    return MATERIAL_700_COLORS[colorIndex];
};
