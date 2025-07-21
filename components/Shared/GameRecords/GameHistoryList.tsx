'use client';

import React, { useState } from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { GameCard } from './GameCard';
import { useQueries } from '@tanstack/react-query';
import GameHistoryControls from './GameHistoryControls';
import { useConvex } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import {
    Id,
    Doc,
} from '../../../../../packages/convex/convex/_generated/dataModel';
import { GameDetails } from '../../hooks/useGameHistory';

export const GameHistoryList = ({
    games,
    user,
}: {
    games: GameDetails[];
    user: Doc<'users'>;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('N/A');
    const [statusFilter, setStatusFilter] = useState('All Games');

    const filteredGames = games
        .filter(
            (game) =>
                game.game_id.toString().includes(searchTerm) ||
                game.game_start_time.toString().includes(searchTerm),
        )
        .sort((a, b) => {
            if (sortOption === 'Latest') {
                return (
                    b.game_start_time.getTime() - a.game_start_time.getTime()
                );
            } else if (sortOption === 'Oldest') {
                return (
                    a.game_start_time.getTime() - b.game_start_time.getTime()
                );
            }
            return b.game_start_time.getTime() - a.game_start_time.getTime();
        });

    const convex = useConvex();
    const gameIds = filteredGames.map((game) => game.game_id);
    const gameQueries = useQueries({
        queries: gameIds?.map((gameId) => ({
            queryKey: ['gameData', gameId],
            queryFn: () =>
                convex.query(api.tasks.getGameDataPublic, {
                    gameId: gameId as Id<'gameData'>,
                }),
        })),
    });

    return (
        <VStack spacing={3} w="100%">
            <GameHistoryControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOption={sortOption}
                setSortOption={setSortOption}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            <Box width="100%" borderRadius="xl">
                <VStack width="100%" spacing={6} py={4}>
                    {filteredGames?.map((game, index) => {
                        const gameData = gameQueries[index]?.data?.gameData;
                        
                        // Apply status filter based on archived field
                        if (statusFilter !== 'All Games') {
                            if (statusFilter === 'WITHDRAWN' && !gameData?.archived) {
                                return null; // Skip completed games that are not archived
                            }
                            if (statusFilter === 'ACTIVE' && gameData?.archived) {
                                return null; // Skip ongoing games that are archived
                            }
                        }
                        
                        return (
                            <Box
                                key={index}
                                w="100%"
                                pb={
                                    index === filteredGames.length - 1
                                        ? '11rem'
                                        : 0
                                }
                            >
                                <GameCard
                                    game={game}
                                    gameData={gameData}
                                    user={user}
                                    loading={gameQueries[index]?.isLoading}
                                />
                            </Box>
                        );
                    })}
                </VStack>
            </Box>
        </VStack>
    );
};

export default GameHistoryList;
