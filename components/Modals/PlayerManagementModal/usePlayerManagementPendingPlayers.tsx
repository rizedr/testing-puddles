import { useState } from 'react';
import useGameData from '../../hooks/useGameData';

export const usePlayerManagementPendingPlayers = () => {
    const [sortBy, setSortBy] = useState<
        'Time Joined' | 'Buy In Amount' | 'Player Name'
    >('Time Joined');
    const { pendingPlayers } = useGameData();

    return {
        sortBy,
        setSortBy,
        pendingPlayers,
    };
};
