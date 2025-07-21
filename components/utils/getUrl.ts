export const getBaseUrl = () => {
    const isDev = process.env.NODE_ENV === 'development';

    if (typeof window !== 'undefined') {
        return isDev
            ? `${window.location.protocol}//${window.location.host}`
            : 'https://www.ginzagaming.com';
    }
    // Fallback for server-side
    return isDev ? 'http://localhost:3000' : 'https://www.ginzagaming.com';
};

export const getPokerUrl = () => {
    const isDev = process.env.NODE_ENV === 'development';

    if (typeof window !== 'undefined') {
        return isDev
            ? `${window.location.protocol}//${window.location.host}/poker`
            : 'https://www.ginzagaming.com/poker';
    }
    // Fallback for server-side
    return isDev ? 'http://localhost:3000/poker' : 'https://www.ginzagaming.com/poker';
};

export const checkGameLink = (url: string) => {
    if (!url.startsWith('http')) {
        const gameUrl = getPokerUrl();
        const protocol = gameUrl.split('//')[0] + '//';
        const baseUrlNoProtocol = gameUrl.split('//')[1];
        const gamePattern = new RegExp(`^(?:https?:\/\/)?${baseUrlNoProtocol.replace(/\./g, '\\.')}\/[a-zA-Z0-9-=?]+$`);
        return gamePattern.test(url) ? protocol + url : null;
    }
    try {
        new URL(url);
        return url;
    } catch {
        return null;
    }
};
