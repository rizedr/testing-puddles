import { Player } from '../../client';

export const getPlayerId = (player?: Player | null) => {
    if (!player) return '';
    let id = player.player_id;
    if (id.length > 10) {
        id = `${id.slice(0, 7)}...${id.slice(-4)}`;
    }
    return id;
};

export const getPlayerUsername = (player?: Player | null) => {
    if (!player) return '';
    let username = player?.username;
    if (username?.length > 11) {
        username = `${username?.slice(0, 7)}...${username?.slice(-4)}`;
    }
    return username;
};

export const truncated = (label?: string) => {
    if (!label) return '';
    if (label.length > 11) {
        label = `${label.slice(0, 7)}...${label.slice(-4)}`;
    }
    return label;
};

export function isValidCharacterSet(username: string): boolean {
    // Define a regex pattern for the GSM character set, popular language characters, and East Asian characters
    const pattern =
        /^[\x20-\x7E\xA0\xC0-\xFF\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF]*$/u;
    return pattern.test(username);
}

export const maxUsernameLength = 20;
export function isValidLength(username: string): boolean {
    return username.length <= 20;
}
