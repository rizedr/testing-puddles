import {
    Flex,
    HStack,
    Text,
    VStack,
    Image,
    useToast,
    Button,
    useBreakpointValue,
} from '@chakra-ui/react';

import useGameData from '../hooks/useGameData';
import { PokerGameState, voteDealChoice } from '../../client';
import { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { useQuery } from 'convex/react';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../packages/convex/convex/_generated/dataModel';
import useUserStatus from '../hooks/useUserStatus';
import useViewer from '../hooks/useViewer';

export const RunItTwiceVoteNotification = () => {
    const { gameState } = useGameData();
    const [hasVoted, setHasVoted] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    if (gameState !== PokerGameState.DEAL_CHOICE) return null;

    return (
        <Flex
            position="fixed"
            top="50%"
            left="50%"
            transform={isPortrait ? "translate(-50%, -42%)" : "translate(26vmin, -25vmin)"}
            zIndex={2000}
        >
            <VotePrompt onVoteSubmitted={() => setHasVoted(true)} />
        </Flex>
    );
};

interface VotePromptProps {
    onVoteSubmitted: () => void
}


const VotePrompt = ({ onVoteSubmitted }: VotePromptProps) => {
    const toast = useToast();
    // Get the raw gameData for deal_choice_votes
    const gameDataQuery = useQuery(api.tasks.getGameDataPublic, {
        gameId: useGameData().gameId as Id<'gameData'>,
    });
    const gameData = gameDataQuery?.gameData;
    const { gameId, targetTime, players } = useGameData();
    const [voteYesLoading, setVoteYesLoading] = useState(false);
    const [voteNoLoading, setVoteNoLoading] = useState(false);
    const [progress, setProgress] = useState(100);
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [submittedVote, setSubmittedVote] = useState<null | boolean>(null);
    const { isSpectator, isAway, isFolded, isPlayer } = useUserStatus();
    const { userId } = useViewer();

    // Timer logic
    useEffect(() => {
        const TIMER_FULL = 10;
        if (!targetTime) return;
        const update = () => {
            const now = Date.now() / 1000;
            const timeLeft = Math.max(0, targetTime - now);
            setRemainingSeconds(Math.ceil(timeLeft));
            setProgress(Math.max(0, Math.min(100, (timeLeft / TIMER_FULL) * 100)));
        };
        update();
        const interval = setInterval(update, 100);
        return () => clearInterval(interval);
    }, [targetTime]);

    const handleError = (error: any) => {
        toast({
            title: `Unable to submit vote: ${error}`,
            status: 'error',
            duration: 2000,
        });
    };

    const handleVote = (vote: boolean) => {
        if (vote) {
            setVoteYesLoading(true);
        } else {
            setVoteNoLoading(true);
        }

        onVoteSubmitted();
        setSubmittedVote(vote);

        voteDealChoice({
            path: {
                game_id: gameId,
            },
            body: {
                vote: vote ? 2 : 1
            }
        }).then(() =>
            toast({
                title: 'Vote Submitted',
                description: `You voted to ${vote ? 'run it twice' : 'run it once'}.`,
                status: 'success',
                duration: 3000,
            })
        ).catch((error: any) => {
            handleError(error);
        }).finally(() => {
            setVoteYesLoading(false);
            setVoteNoLoading(false);
        });
    };

    // Voting status logic
    const dealChoiceVotes = gameData?.deal_choice_votes || {};

    // Find the current player's id
    const myPlayer = players?.find((p: any) => p.player_id === userId);
    const myPlayerId = myPlayer?.player_id;
    const alreadyVoted = myPlayerId && dealChoiceVotes[myPlayerId] > 0;

    return (
        <VStack
            bg="#131418"
            w="100%"
            borderRadius="0.5rem"
            padding="0.7rem"
            spacing="0.5rem"
            border="0.5px solid rgba(255, 255, 255, 0.5)"
            align="stretch"
        >
            {/* Timer Bar at the top: purple shrinks left, gray remains */}
            <Flex w="100%" h="0.75rem" bg="gray.700" borderRadius="0.375rem" overflow="hidden" position="relative">
                {/* Gray background bar (full width) */}
                <Flex
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    right={0}
                    bg="gray.700"
                    borderRadius="0.375rem"
                    zIndex={0}
                />
                {/* Purple foreground bar (shrinks left as time passes, full if >= 12s) */}
                <Flex
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    bgGradient="linear(to-r, #B37FEB, #4B2B82)"
                    borderRadius="0.375rem"
                    width={progress + '%'}
                    transition="width 0.1s linear"
                    zIndex={1}
                />
            </Flex>
            {/* Row: Deal Choice left, seconds right */}
            <Flex w="100%" justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" color="gray.300" fontSize="1.05rem" letterSpacing={1}>
                    Deal Choice
                </Text>
                <Text fontSize="0.95rem" color="brand.white80" minW="2.5rem" textAlign="right">
                    {remainingSeconds}s
                </Text>
            </Flex>
            {/* Only show voting buttons if eligible */}
            {isPlayer && !isSpectator && !isAway && !isFolded && (
                <HStack w="100%" spacing={2}>
                    <Button
                        variant="walletButton"
                        w="100%"
                        h="3.25rem"
                        py={6}
                        isLoading={voteNoLoading}
                        onClick={() => handleVote(false)}
                        fontWeight="bold"
                        fontSize="1rem"
                        isDisabled={alreadyVoted || submittedVote !== null}
                        bg={
                            submittedVote !== null
                                ? (submittedVote === false ? undefined : 'gray.600')
                                : (alreadyVoted && dealChoiceVotes[myPlayerId] === 2 ? 'gray.600' : undefined)
                        }
                        _hover={submittedVote !== null || (alreadyVoted && dealChoiceVotes[myPlayerId]) ? { bg: 'gray.600' } : undefined}
                        _active={submittedVote !== null || (alreadyVoted && dealChoiceVotes[myPlayerId]) ? { bg: 'gray.600' } : undefined}
                        cursor={submittedVote !== null || alreadyVoted ? 'not-allowed' : undefined}
                    >
                        <VStack spacing={0} w="100%">
                            <Text fontSize="0.8rem" color="gray.400" fontWeight="bold" lineHeight={1}>
                                Run It
                            </Text>
                            <Text fontSize="1rem" color="brand.accentWhite" fontWeight="bold" lineHeight={1}>
                                ONCE
                            </Text>
                        </VStack>
                    </Button>
                    <Button
                        variant="walletButton"
                        w="100%"
                        h="3.25rem"
                        py={6}
                        isLoading={voteYesLoading}
                        onClick={() => handleVote(true)}
                        fontWeight="bold"
                        fontSize="1rem"
                        isDisabled={alreadyVoted || submittedVote !== null}
                        bg={
                            submittedVote !== null
                                ? (submittedVote === true ? undefined : 'gray.600')
                                : (alreadyVoted && dealChoiceVotes[myPlayerId] === 1 ? 'gray.600' : undefined)
                        }
                        _hover={submittedVote !== null || (alreadyVoted && dealChoiceVotes[myPlayerId]) ? { bg: 'gray.600' } : undefined}
                        _active={submittedVote !== null || (alreadyVoted && dealChoiceVotes[myPlayerId]) ? { bg: 'gray.600' } : undefined}
                        cursor={submittedVote !== null || alreadyVoted ? 'not-allowed' : undefined}
                    >
                        <VStack spacing={0} w="100%">
                            <Text fontSize="0.8rem" color="gray.400" fontWeight="bold" lineHeight={1}>
                                Run It
                            </Text>
                            <Text fontSize="1rem" color="white" fontWeight="bold" lineHeight={1}>
                                TWICE
                            </Text>
                        </VStack>
                    </Button>
                </HStack>
            )}
            {/* Voting Status */}
            <VStack w="100%" align="stretch" spacing={1} mt={1}>
                {Object.keys(dealChoiceVotes).map((player_id) => {
                    const vote = dealChoiceVotes[player_id];
                    const { user } = useUser(player_id);
                    let voteText = 'WAITING...';
                    let voteColor = 'gray.400';
                    if (vote === 1) {
                        voteText = 'ONCE';
                        voteColor = 'orange.300';
                    } else if (vote === 2) {
                        voteText = 'TWICE';
                        voteColor = 'purple.300';
                    }
                    return (
                        <HStack key={player_id} spacing={3} align="center">
                            <Image
                                src={user?.imageUrl}
                                width="1.5rem"
                                height="1.5rem"
                                borderRadius="50%"
                                alt={user?.username || 'User'}
                                bg="gray.800"
                            />
                            <Text fontWeight="bold" color={voteColor} fontSize="0.92rem">
                                {voteText}
                            </Text>
                        </HStack>
                    );
                })}
            </VStack>
        </VStack>
    );
};
