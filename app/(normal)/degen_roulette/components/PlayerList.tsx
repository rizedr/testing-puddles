import { VStack, Text } from '@chakra-ui/react';
import { Player } from './types';
import { PlayerRow } from './PlayerRow';

interface PlayerListProps {
    players: Player[];
    totalBet: number;
}

export const PlayerList = ({ players, totalBet }: PlayerListProps) => {
    return (
        <VStack alignItems="flex-start" w="100%" overflow="hidden" h="100%">
            <Text fontSize="lg" fontWeight="bold">
                {players.length} Players
            </Text>
            <VStack overflowY="auto" w="100%" spacing={2}>
                {players.map((player) => (
                    <PlayerRow
                        key={player.player_id}
                        playerId={player.player_id}
                        betAmount={player.bet_amount}
                        winningChance={
                            (player.bet_amount / totalBet) * 100
                        }
                    />
                ))}
            </VStack>
        </VStack>
    );
};
