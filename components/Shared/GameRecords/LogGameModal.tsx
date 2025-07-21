import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    VStack,
    Text,
    Input,
    FormControl,
    FormLabel,
    Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { Id, Doc } from '../../../../../packages/convex/convex/_generated/dataModel';
import { LogMessage } from '../../GamePage/Poker/Controls/Shared/Message';
import { LogType } from '../../../client';

interface LogGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: Id<'gameData'>;
}

export const LogGameModal: React.FC<LogGameModalProps> = ({
    isOpen,
    onClose,
    gameId,
}: LogGameModalProps) => {
    const [handNumber, setHandNumber] = useState<string>('');
    const [submittedHandNumber, setSubmittedHandNumber] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Query for game data
    const gameData = useQuery(
        api.tasks.getGameData,
        isOpen && gameId ? { gameId } : "skip"
    );

    // Check if logs are available (nonce >= 2 AND game created after June 20, 2025)
    const gameCreationDate = gameData?.gameData?.game_start_time ? new Date(gameData.gameData.game_start_time) : null;
    const june20_2025 = new Date('2025-06-20');
    const hasNoLogs = !gameData?.gameData?.nonce || gameData.gameData.nonce < 2 || (gameCreationDate && gameCreationDate <= june20_2025);
    
    // Show loading state while game data is being fetched
    const isLoading = gameData === undefined;

    // Get the maximum hand number from game data (nonce - 1)
    const maxHandNumber = Math.max(0, (gameData?.gameData?.nonce || 0) - 1);

    // Query for hand history logs using the admin version
    const handHistoryLogs = useQuery(
        api.tasks.getHandHistoryLogsPublic,
        submittedHandNumber && gameId
            ? { gameId, handNumber: submittedHandNumber }
            : "skip"
    );

    // Clear hand number when modal opens
    useEffect(() => {
        if (isOpen) {
            setHandNumber('');
            setSubmittedHandNumber('');
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!handNumber.trim()) {
            setError("Please enter a hand number");
            setSubmittedHandNumber('');
            return;
        }
        
        const handNum = parseInt(handNumber);
        if (isNaN(handNum) || handNum < 1 || handNum > maxHandNumber || !Number.isInteger(handNum)) {
            setError(`Hand number must be an integer between 1 and ${maxHandNumber}`);
            setSubmittedHandNumber('');
            return;
        }
        
        setSubmittedHandNumber(handNumber);
    };

    const handleClose = () => {
        setHandNumber('');
        setSubmittedHandNumber('');
        setError(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
            <ModalContent
                w="95vw"
                maxW="520px"
                minH={hasNoLogs ? "320px" : "600px"}
                maxH="80vh"
                textColor="rgba(255, 255, 255, 0.875)"
                borderRadius="1rem"
                overflow="hidden"
                boxShadow="0 0 4px rgba(255, 255, 255, 0.25)"
                borderColor="brand.silverGray"
                borderWidth="1px"
                backgroundColor="brand.darkestGray"
            >
                
                <ModalCloseButton color="white" />

                <ModalBody>
                    <VStack w="100%" gap={4} alignItems="stretch">
                        <Text fontSize="lg" fontWeight="bold" color="white" textAlign="center">Search Hand History</Text>
                        <Text fontSize="sm" color="gray.400" mb="0.5rem" textAlign="center">Game ID: {gameId}</Text>

                        {/* Show loading spinner while data is being fetched */}
                        {isLoading && (
                            <Box
                                w="100%"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                p={8}
                            >
                                <Spinner size="lg" color="purple.400" />
                            </Box>
                        )}

                        {/* Show error message if no logs available */}
                        {!isLoading && hasNoLogs && (
                            <Box
                                w="100%"
                                bg="red.900"
                                border="1px solid"
                                borderColor="red.400"
                                p={4}
                                borderRadius="16px"
                                textAlign="center"
                            >
                                <Text color="red.200" fontSize="lg" fontWeight="bold">
                                    No Game Logs Available
                                </Text>
                                <Text color="red.100" fontSize="sm" mt={2}>
                                    This game has no hand history logs to display.
                                </Text>
                            </Box>
                        )}

                        {/* Search Form Container - only show if logs are available */}
                        {!isLoading && !hasNoLogs && (
                            <Box
                                w="100%"
                                // bg="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
                                border="0.1rem solid"
                                borderColor="purple.400"
                                p={6}
                                borderRadius="16px"
                                boxShadow="lg"
                            >
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl>
                                        <FormLabel htmlFor="handNumber" fontSize="sm" fontWeight="medium" color="purple.100">
                                            Hand Number (1 - {maxHandNumber})
                                        </FormLabel>
                                        <Input
                                            id="handNumber"
                                            bg="gray.900"
                                            color="white"
                                            value={handNumber}
                                            onChange={(e) => setHandNumber(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleSubmit(e as any);
                                                }
                                            }}
                                            placeholder={`Enter hand number (1-${maxHandNumber})`}
                                            _placeholder={{ color: 'gray.400' }}
                                            type="number"
                                            min={1}
                                            max={maxHandNumber}
                                            step={1}
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        variant="walletButton"
                                        isDisabled={!!submittedHandNumber && handHistoryLogs === undefined}
                                        w="100%"
                                    >
                                        {!!submittedHandNumber && handHistoryLogs === undefined ? 
                                            <Spinner size="sm" color="white" /> : 
                                            "View Log"
                                        }
                                    </Button>
                                </VStack>
                            </form>
                            {error && (
                                <Box mt={3} bg="red.100" color="red.800" p={2} borderRadius="md">
                                    {error}
                                </Box>
                            )}
                        </Box>
                        )}

                        {/* Results Container - only show if logs are available */}
                        {!isLoading && !hasNoLogs && (
                        <Box
                            w="100%"
                            bg="rgb(15, 15, 15, 0.9)"
                            borderRadius="16px"
                            boxShadow="lg"
                            minHeight="200px"
                            maxHeight="400px"
                            overflowY="auto"
                            p={4}
                        >
                            {submittedHandNumber && handHistoryLogs === undefined ? (
                                <Spinner />
                            ) : handHistoryLogs && handHistoryLogs.length > 0 ? (
                                <VStack align="start" spacing={2}>
                                    {handHistoryLogs.flatMap((log: any) => {
                                        // Skip PLAYERS log type entirely
                                        if (log.logType === LogType.PLAYERS) {
                                            return null;
                                        } else if (log.logType !== LogType.HAND_START) {
                                            return <LogMessage key={log._id} log={log as Doc<'gameLogs'>}/>;
                                        }
                                        return null;
                                    })}
                                </VStack>
                            ) : submittedHandNumber ? (
                                <Text color="gray.400">No hand history found for hand #{submittedHandNumber}.</Text>
                            ) : (
                                <Text color="gray.400">Enter a hand number to view the log.</Text>
                            )}
                        </Box>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}; 
