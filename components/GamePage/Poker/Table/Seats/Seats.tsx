import { HStack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useGetPlayerUIPositions } from '../../../../hooks/useGetPlayerUIPositions';
import { Seat } from './Seat/Seat';
import { useGetCurrentPlayer } from '../../../../hooks/useGetCurrentPlayer';
import { useUserStatus } from '../../../../hooks/useUserStatus';
import { usePokerGameState } from '../../../../hooks/usePokerGameState';
import { PokerGameState } from '../../../../types/PokerGameState';
import GameBoard, { StartButton } from '../Table/GameBoard';
import { CommunityCards } from '../Table/CommunityCards';
import { PotDisplay } from '../Table/PotDisplay/PotDisplay';
import { useShowBombPot } from '../../../../hooks/useShowBombPot';
import { BombPotAlert } from '../Table/BombPotAlert';

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const Seats = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    const { playerPositions } = useGetPlayerUIPositions();
    const displayPositions = [...playerPositions];
    const gameState = usePokerGameState();
    const { isHost } = useUserStatus();
    const currentPlayer = useGetCurrentPlayer();
    const showBombPot = useShowBombPot();
    
    const hasGameStarted = gameState !== PokerGameState.CREATE;

    const computeIndex = (index: number) => {
        return mod((currentPlayer?.index || 4) + index - 4, 9);
    };

    let rows = (
        <>
            <HStack justify="space-around" pl="4vmin" pr="4vmin">
                <Seat player={displayPositions[8]} index={computeIndex(8)} />
                <Seat player={displayPositions[0]} index={computeIndex(0)} />
            </HStack>
            <HStack w="100%" justify="space-between">
                <Seat player={displayPositions[7]} index={computeIndex(7)} />
                <PotDisplay />
                <Seat player={displayPositions[1]} index={computeIndex(1)} />
            </HStack>
            <VStack spacing="1rem" justifyContent="center">
                <CommunityCards />
                {showBombPot && <BombPotAlert />}
                {isHost && !hasGameStarted && <StartButton />}
            </VStack>
            <HStack w="100%" justify="space-between">
                <Seat player={displayPositions[6]} index={computeIndex(6)} />
                <Seat player={displayPositions[2]} index={computeIndex(2)} />
            </HStack>
            <HStack w="100%" justify="space-around" px="4vmin">
                <Seat player={displayPositions[5]} index={computeIndex(5)} />
                <Seat player={displayPositions[4]} index={computeIndex(4)} />
                <Seat player={displayPositions[3]} index={computeIndex(3)} />
            </HStack>
        </>
    );

    if (isPortrait) {
        rows = (
            <>
                <HStack w="100%" justify="space-between" pt="1.5vmax" pl="5vmax" pr="5vmax">
                    <Seat
                        player={displayPositions[8]}
                        index={computeIndex(8)}
                    />
                    <Seat
                        player={displayPositions[0]}
                        index={computeIndex(0)}
                    />
                </HStack>
                <HStack w="100%" justify="space-between" py="1.75vmax" pl="0.2vmax" pr="0.185vmax">
                    <Seat
                        player={displayPositions[7]}
                        index={computeIndex(7)}
                    />
                    <Seat
                        player={displayPositions[1]}
                        index={computeIndex(1)}
                    />
                </HStack>
                <GameBoard />
                <HStack w="100%" justify="space-between" py="1.75vmax" pl="0.2vmax" pr="0.185vmax">
                    <Seat
                        player={displayPositions[6]}
                        index={computeIndex(6)}
                    />
                    <Seat
                        player={displayPositions[2]}
                        index={computeIndex(2)}
                    />
                </HStack>
                <HStack w="100%" justify="space-between" pb="2.35vmax" pl="0.2vmax" pr="0.185vmax">
                    <Seat
                        player={displayPositions[5]}
                        index={computeIndex(5)}
                    />
                    <Seat
                        player={displayPositions[3]}
                        index={computeIndex(3)}
                    />
                </HStack>
                <HStack w="100%" justify="center" align="center" pt="2vmax" mt="0.35vmax">
                    <Seat
                        player={displayPositions[4]}
                        index={computeIndex(4)}
                    />
                </HStack>
            </>
        );
    }

    return (
        <VStack
            h={isPortrait ? "100%" : `min(100%, 38vw)`}
            w={isPortrait ? "100%" : `min(120vmin, 80vw)`}
            zIndex={2}
            alignItems="stretch"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            justifyContent="space-between"
            flex={1}
        >
            {rows}
        </VStack>
    );
};

export default Seats;
