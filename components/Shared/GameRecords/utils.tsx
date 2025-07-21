import { GameMode } from '../../../client';
import { format } from 'date-fns'; // We'll use this for formatting dates

export const formatDateTime = (isoDateStr: string | number | Date) => {
    return (
        <>
            {format(new Date(isoDateStr), 'MMM d, yyyy')}{' '}
            {format(new Date(isoDateStr), 'h:mm a')}
        </>
    );
};

export const getGameTypeString = (gameMode: GameMode) => {
    return gameMode === GameMode.NLH ? "NL HOLD'EM" : 'POT-LIMIT OMAHA';
};

export const encodeBase64 = (str: string) =>
    Buffer.from(str).toString('base64').replace(/[/+=]/g, '');

export const getGamePnlString = (pnl: string) => {
    const firstChar = pnl.charAt(0);
    const cleanPnl = firstChar === '+' ? pnl.slice(1) : pnl.slice(1);

    if (firstChar === '$' || firstChar === '+') {
        return `won ${cleanPnl}! 🎉`;
    } else {
        return `lost ${cleanPnl} 😭`;
    }
};
