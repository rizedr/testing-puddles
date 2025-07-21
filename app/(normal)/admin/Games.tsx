'use client';

import {
    HStack,
    Box,
    Heading,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Tooltip,
    useToast,
    Flex,
    Text,
    Badge,
    Input,
    Button,
    FormControl,
    FormLabel,
    Card,
    CardBody,
    SimpleGrid,
    Divider,
    VStack,
    useBreakpointValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Code,
} from '@chakra-ui/react';
import { useQuery, usePaginatedQuery, useConvex } from "convex/react";
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, ViewIcon, ChevronRightIcon as SearchIcon, SearchIcon as MagnifyIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Id, Doc } from "../../../../../packages/convex/convex/_generated/dataModel";
import { FaArchive } from 'react-icons/fa';
import { archiveGame, LogType } from '../../../client';
import { LogMessage } from '../../../components/GamePage/Poker/Controls/Shared/Message';

const ITEMS_PER_PAGE = 10;

export const Games = () => {
    const { results: activeGames, loadMore, status } = usePaginatedQuery(api.tasks.getActiveGameDataWithRevenue, {}, { initialNumItems: ITEMS_PER_PAGE });
    const toast = useToast();
    const [currentPage, setCurrentPage] = useState(0);
    
    
    // Search game state
    const [searchGameId, setSearchGameId] = useState("");
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [validatedGameId, setValidatedGameId] = useState<Id<"gameData"> | null>(null);

    const searchedGame = useQuery(
        api.tasks.getGameData, 
        validatedGameId ? { gameId: validatedGameId } : "skip"
    );
    // const searchedGameData = useQuery(
    //     api.tasks.batchGetGameRevenue, 
    //     validatedGameId ? { gameIds: [validatedGameId] } : "skip"
    // );
    
    const [referrals, setReferrals] = useState<Array<{
        referrerId: string,
        referrerUsername: string,
        count: number,
        referredUsers: Array<{ userId: string, username: string }>
    }>>([]);
    // const [loadingReferrals, setLoadingReferrals] = useState(false);

    const getUsernames = useQuery(
        api.users.batchGetUsernames,
        validatedGameId && searchedGame?.gameData?.internals?.referred_by ? 
        { userIds: Object.keys(searchedGame.gameData.internals.referred_by || {}) } : "skip"
    );

    // Add a query to get current user data (add this with the other useQuery calls)
    const currentUser = useQuery(api.users.current);

    // Get game statistics data
    const gameStats = useQuery(api.tasks.getGameStatisticsByMonth);
    const archivedGameStats = useQuery(api.tasks.getArchivedGameStatisticsByMonth);

    // Reset error when input changes
    useEffect(() => {
        setSearchError(null);
    }, [searchGameId]);
    
    const isValidGameId = (id: string): boolean => {
        // Basic check for Convex ID format (this is simple validation, actual format may vary)
        return /^[a-zA-Z0-9_]+$/.test(id) && id.length > 8;
    };

    const handleSearchGame = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchLoading(true);
        setValidatedGameId(null);
        
        if (!searchGameId.trim()) {
            setSearchError("Please enter a game ID");
            setSearchLoading(false);
            return;
        }
        
        if (!isValidGameId(searchGameId)) {
            setSearchError("Invalid game ID format");
            setSearchLoading(false);
            return;
        }
        
        try {
            // Attempt to cast the ID - this will only be used if it passes validation
            setValidatedGameId(searchGameId as Id<"gameData">);
            setSearchLoading(false);
        } catch (error) {
            setSearchError("Invalid game ID");
            setSearchLoading(false);
        }
    };
    
    const truncateId = (id: string) => {
        if (!id) return '';
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: '2-digit' 
        }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getGameType = (gameType: bigint) => {
        return gameType === 0n ? "POKER" : "ROULETTE";
    };

    const getVisibility = (visibility: bigint) => {
        return visibility === 0n ? "PUBLIC" : "PRIVATE";
    };

    const getGameMode = (gameData: any) => {
        if (!gameData?.game_settings?.game_mode && gameData?.game_settings?.game_mode !== 0) return "N/A";
        switch (gameData.game_settings.game_mode) {
            case 0:
                return "NLH";
            case 1:
                return "PLO";
            default:
                return gameData.game_settings.game_mode;
        }
    };

    const formatBlinds = (gameData: any) => {
        if (!gameData?.game_settings?.small_blind_value || !gameData?.game_settings?.big_blind_value) {
            return 'N/A';
        }
        
        const smallBlind = Number(gameData.game_settings.small_blind_value) / 1000000;
        const bigBlind = Number(gameData.game_settings.big_blind_value) / 1000000;
        
        return `${smallBlind}/${bigBlind}`;
    };

    const formatRevenue = (revenue: bigint) => {
        const revenueNumber = Number(revenue) / 1000000;
        return `$${revenueNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatPlayerCount = (gameData: any) => {
        if (!gameData?.players) return '0/9';
        return `${gameData.players.length}/9`;
    };

    // Calculate pagination data
    const totalPages = activeGames ? Math.ceil(activeGames.length / ITEMS_PER_PAGE) : 0;
    const paginatedGames = activeGames 
        ? activeGames.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
        : [];

    const canClickNext = useMemo(() => status === "CanLoadMore" || ( status === "Exhausted" && currentPage < totalPages - 1), [status, currentPage, totalPages]);
        
    const handleNextPage = () => {

        
        if (status === "CanLoadMore") {
            setCurrentPage(currentPage + 1);
            loadMore(ITEMS_PER_PAGE);
        }

        if (canClickNext) {

            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        if (searchedGame && getUsernames) {
            const referredBy = searchedGame.gameData?.internals?.referred_by || {};
            
            // Reverse the structure to group by referrer
            const referrerMap: Record<string, string[]> = {};
            
            Object.entries(referredBy).forEach(([userId, referrerId]) => {
                if (!referrerMap[referrerId as string]) {
                    referrerMap[referrerId as string] = [];
                }
                referrerMap[referrerId as string].push(userId);
            });
            
            // Transform to sorted array with usernames
            const referralData = Object.entries(referrerMap).map(([referrerId, userIds]) => ({
                referrerId,
                referrerUsername: getUsernames[referrerId] || truncateId(referrerId),
                count: userIds.length,
                referredUsers: userIds.map(userId => ({
                    userId,
                    username: getUsernames[userId] || truncateId(userId)
                }))
            }));
            
            // Sort by count (highest first)
            referralData.sort((a, b) => b.count - a.count);
            
            setReferrals(referralData);
        } else {
            setReferrals([]);
        }
    }, [searchedGame, getUsernames]);

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    // Add a function to handle quick search for a game
    const handleQuickSearch = (gameId: string) => {
        setSearchGameId(gameId);
        setSearchError(null);
        setValidatedGameId(gameId as Id<"gameData">);
    };
    
    // Add state for revenue breakdown
    const [revenueBreakdown, setRevenueBreakdown] = useState<{
        adminAmount: bigint;
        referrals: Array<{
            userId: string;
            username: string;
            amount: bigint;
        }>;
        affiliates: Array<{
            userId: string;
            username: string;
            amount: bigint;
        }>;
    } | null>(null);
    
    // Get the revenue breakdown data
    const gameRevenueBreakdown = useQuery(
        api.tasks.getGameRevenueBreakdown,
        validatedGameId ? { gameId: validatedGameId } : "skip"
    );
    
    useEffect(() => {
        if (gameRevenueBreakdown) {
            setRevenueBreakdown(gameRevenueBreakdown);
        } else {
            setRevenueBreakdown(null);
        }
    }, [gameRevenueBreakdown]);

    // Archive game state
    const [archivingGameId, setArchivingGameId] = useState<string | null>(null);
    
    const handleArchiveGame = useCallback(async (gameId: string) => {
        setArchivingGameId(gameId);
        try {
            await archiveGame({
                path: {
                    game_id: gameId
                }
            });
            toast({
                title: 'Game archived',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'bottom-right',
            });
        } catch (error: any) {
            toast({
                title: 'Error archiving game',
                description: error.body?.detail || error.message || 'Failed to archive game',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-right',
            });
        } finally {
            setArchivingGameId(null);
        }
    }, [toast]);

    // Hand History state
    const [handHistoryGameId, setHandHistoryGameId] = useState("");
    const [handHistoryNumber, setHandHistoryNumber] = useState("");
    const [handHistoryError, setHandHistoryError] = useState<string | null>(null);
    const [handHistorySubmitted, setHandHistorySubmitted] = useState(false);

    const handHistoryLogs = useQuery(
        api.tasks.getHandHistoryLogs,
        handHistorySubmitted && handHistoryGameId && handHistoryNumber
            ? { gameId: handHistoryGameId as Id<"gameData">, handNumber: handHistoryNumber }
            : "skip"
    );

    const handleHandHistorySearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHandHistoryError(null);
        if (!handHistoryGameId.trim() || !handHistoryNumber.trim()) {
            setHandHistoryError("Please enter both game ID and hand number");
            setHandHistorySubmitted(false);
            return;
        }
        setHandHistorySubmitted(true);
    };

    // --- Filtered Pagination State for Game History ---
    const PAGE_SIZE = 20;
    const [historyGames, setHistoryGames] = useState<any[]>([]);
    const [historyCursor, setHistoryCursor] = useState<string | null>(null);
    const [historyIsDone, setHistoryIsDone] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(0); // 0-based page index
    const historyCursors = useRef<(string|null)[]>([null]); // Track cursors for Previous
    const convex = useConvex();

    // Fetch a backend page and accumulate qualifying games
    const fetchHistoryPage = useCallback(async (cursor: string | null, reset = false) => {
        setHistoryLoading(true);
        let qualifyingGames: any[] = reset ? [] : [...historyGames];
        let backendCursor = cursor;
        let isDone = false;
        while (qualifyingGames.length < PAGE_SIZE && !isDone) {
            // Fetch a backend page
            const res = await convex.query(api.tasks.getGameHistoryWithRevenue, {
                paginationOpts: {
                    numItems: 20,
                    cursor: backendCursor,
                },
            });
            if (!res) break;
            const pageGames = res.page || [];
            qualifyingGames = qualifyingGames.concat(pageGames);
            backendCursor = res.continueCursor;
            isDone = res.isDone;
            if (isDone || !backendCursor) break;
        }
        setHistoryGames(qualifyingGames.slice(0, PAGE_SIZE));
        setHistoryCursor(backendCursor || null);
        setHistoryIsDone(isDone || !backendCursor);
        setHistoryLoading(false);
    }, [historyGames, convex]);

    // Initial load and when page changes
    useEffect(() => {
        fetchHistoryPage(historyCursors.current[historyPage], true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historyPage]);

    // Next/Prev handlers
    const handleNextHistoryPage = () => {
        if (!historyIsDone && historyCursor) {
            historyCursors.current[historyPage + 1] = historyCursor;
            setHistoryPage(historyPage + 1);
        }
    };
    const handlePrevHistoryPage = () => {
        if (historyPage > 0) {
            setHistoryPage(historyPage - 1);
        }
    };

    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <Box w="100%" alignItems="start">
            <Heading size="md" mb="1rem" color="white">Game Management</Heading>
            
            {/* Search and Results Section */}
            <Flex mb="1.5rem" gap={4} direction={isPortrait ? "column" : "row"}>
                {/* Search Game Section */}
                <Box 
                    w={isPortrait ? "100%" : "50%"}
                    bg="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182" 
                    border="0.1rem solid"
                    borderColor="purple.400"
                    p={6} 
                    borderRadius="16px" 
                    boxShadow="lg"
                >
                    <Heading size="md" mb="1rem" color="white">Search Game</Heading>
                    <Text 
                        fontSize="sm" 
                        color="gray.400" 
                        textAlign="left"
                        mb="0.5rem"
                    >
                        Look up detailed information about a specific game.
                    </Text>

                    <Card 
                        bg="transparent" 
                        color="white"
                        borderRadius="16px"
                    >
                        <CardBody>
                            <form onSubmit={handleSearchGame}>
                                <Flex gap={4} alignItems="flex-end">
                                    <FormControl flex="1">
                                        <FormLabel htmlFor="gameId" fontSize="sm" fontWeight="medium">
                                            Game ID
                                        </FormLabel>
                                        <Input
                                            id="gameId"
                                            bg="gray.900"
                                            value={searchGameId}
                                            onChange={(e) => setSearchGameId(e.target.value)}
                                            placeholder="Enter game ID"
                                        />
                                    </FormControl>
                                    <Button 
                                        type="submit" 
                                        isDisabled={searchLoading}
                                        bg="blue.500"
                                        _hover={{ bg: "blue.600" }}
                                    >
                                        {searchLoading ? <Spinner size="sm" color="white" /> : <SearchIcon color="white" />}
                                    </Button>
                                </Flex>
                            </form>
                        </CardBody>
                    </Card>

                    {searchError && (
                        <Box mt={3} bg="red.100" color="red.800" p={2} borderRadius="md">
                            {searchError}
                        </Box>
                    )}
                </Box>

                {/* Game Details Result Section */}
                <Box 
                    w={isPortrait ? "100%" : "50%"}
                    bg="rgb(15, 15, 15, 0.9)" 
                    borderRadius="16px" 
                    boxShadow="lg"
                    maxHeight={isPortrait ? "400px" : "350px"}
                    overflowY="auto"
                >
                    {searchedGame === undefined ? (
                        <Box p={6}>
                            <Text color="gray.400" textAlign="center">Enter a game ID to see details</Text>
                        </Box>
                    ) : searchedGame === null ? (
                        <Box p={6}>
                            <Text color="red.400" textAlign="center">Game not found</Text>
                        </Box>
                    ) : (
                        <Box p={4} width="100%" height="100%">
                            <Flex justify="space-between" align="center" mb={2}>
                                <Heading size="sm" color="white">
                                    Game Details
                                </Heading>
                                <Link href={`/poker/${searchedGame._id}`} target="_blank" passHref>
                                    <Button 
                                        as="span" 
                                        size="xs" 
                                        colorScheme="blue"
                                        leftIcon={<ViewIcon />}
                                    >
                                        View Game
                                    </Button>
                                </Link>
                            </Flex>
                            <Flex mt={2} mb={4} gap={2}>
                                <Badge colorScheme={searchedGame.gameType === 0n ? "green" : "blue"}>
                                    {getGameType(searchedGame.gameType)}
                                </Badge>
                                <Badge colorScheme={searchedGame.visibility === 0n ? "orange" : "purple"}>
                                    {getVisibility(searchedGame.visibility)}
                                </Badge>
                                <Badge colorScheme={searchedGame.archived ? "red" : "green"}>
                                    {searchedGame.archived ? "ARCHIVED" : "ACTIVE"}
                                </Badge>
                            </Flex>
                            <SimpleGrid columns={2} spacing={2} color="rgb(255, 255, 255, 0.75)">
                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Game ID:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    <HStack spacing="2" justifyContent="flex-end">
                                        <Text>{truncateId(searchedGame._id)}</Text>
                                        <IconButton
                                            aria-label="Copy ID"
                                            icon={<CopyIcon color="white" />}
                                            size="xs"
                                            variant="solid"
                                            bg="purple.500"
                                            _hover={{ bg: "purple.600" }}
                                            onClick={() => copyToClipboard(searchedGame._id)}
                                        />
                                    </HStack>
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Game Mode:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {getGameMode(searchedGame.gameData)}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Blinds:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {formatBlinds(searchedGame.gameData)}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Host:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {searchedGame.gameData?.game_host === "ADMIN" ? (
                                        <Text as="span" color="yellow.300">SYSTEM</Text>
                                    ) : (
                                        truncateId(searchedGame.gameData?.game_host || "")
                                    )}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Players:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {formatPlayerCount(searchedGame.gameData)}
                                </Text>

                                {/* <Text fontWeight="medium" fontSize="sm" textAlign="left">Revenue:</Text>
                                <Text fontSize="sm" textAlign="right" fontWeight="bold">
                                    {searchedGameData && searchedGame._id ? formatRevenue(searchedGameData.revenue) : '$0.00'}
                                </Text> */}

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Surplus:</Text>
                                <Text fontSize="sm" textAlign="right" fontWeight="bold">
                                    {searchedGame.gameData?.surplus ? `$${(Number(searchedGame.gameData.surplus) / 1000000.0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Nonce:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {searchedGame.gameData?.nonce !== undefined ? searchedGame.gameData.nonce : 'N/A'}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Game State:</Text>
                                <Text fontSize="sm" textAlign="right">
                                    {searchedGame.gameData?.game_state !== undefined ? searchedGame.gameData.game_state : 'N/A'}
                                </Text>

                                <Text fontWeight="medium" fontSize="sm" textAlign="left">Last Updated:</Text>
                                <Text fontSize="sm" textAlign="right">
                                </Text>
                            </SimpleGrid>

                            {revenueBreakdown && currentUser?.role === 'ADMIN' && (
                                <Box mt={4}>
                                    <Divider my={2} />
                                    <Heading size="xs" color="white" mb={2} textAlign="center">
                                        Revenue Breakdown
                                    </Heading>
                                    <SimpleGrid columns={2} spacing={2} color="rgb(255, 255, 255, 0.75)">
                                        <Text fontWeight="medium" fontSize="sm" textAlign="left">
                                            <Text color="purple.300" fontWeight="bold" mb={1} textAlign="left">PLATFORM</Text>
                                            <Text mt={1} textAlign="left">Admin</Text>
                                        </Text>
                                        <Text fontSize="xs" textAlign="right" fontWeight="bold">
                                            <Text>&nbsp;</Text>
                                            <Text mt={1} textAlign="right">${(Number(revenueBreakdown.adminAmount) / 1000000.0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                                        </Text>
                                    </SimpleGrid>
                                    
                                    {revenueBreakdown.affiliates.length > 0 && (
                                        <Box mt={2} maxHeight="150px" overflowY="auto">
                                            {revenueBreakdown.affiliates.map((affiliate) => (
                                                <Flex key={affiliate.userId} justify="space-between" fontSize="xs" mb={1}>
                                                    <Flex align="center">
                                                        <Link
                                                            href={`/profile/${affiliate.userId}`}
                                                            target="_blank"
                                                            passHref
                                                        >
                                                            <Text as="span" sx={usernameLinkStyle}>
                                                                {affiliate.username}
                                                            </Text>
                                                        </Link>
                                                        <Badge colorScheme="teal" ml={1}>AFFILIATE</Badge>
                                                    </Flex>
                                                    <Text fontWeight="bold">
                                                        ${(Number(affiliate.amount) / 1000000.0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </Box>
                                    )}
                                    
                                    {revenueBreakdown.referrals.length > 0 && (
                                        <Box mt={2} maxHeight="150px" overflowY="auto">
                                            <Text color="purple.300" fontWeight="bold" mb={1} textAlign="left">HOST</Text>
                                            {revenueBreakdown.referrals.map((referral) => (
                                                <Flex key={referral.userId} justify="space-between" fontSize="xs" mb={1}>
                                                    <Link
                                                        href={`/profile/${referral.userId}`}
                                                        target="_blank"
                                                        passHref
                                                    >
                                                        <Text as="span" sx={usernameLinkStyle}>
                                                            {referral.username}
                                                        </Text>
                                                    </Link>
                                                    <Text fontWeight="bold">
                                                        ${(Number(referral.amount) / 1000000.0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {referrals.length > 0 && (
                                <Box mt={4}>
                                    <Divider my={2} />
                                    <Heading size="xs" color="white" mb={2} textAlign="center">
                                        Referrals
                                    </Heading>
                                    <Flex direction="column" gap={3}>
                                        {referrals.map((referrer) => (
                                            <Box key={referrer.referrerId}>
                                                <Flex justify="space-between" alignItems="center" mb={1}>
                                                    <HStack>
                                                        <Link 
                                                            href={`/profile/${referrer.referrerId}`} 
                                                            target="_blank" 
                                                            passHref
                                                        >
                                                            <Text as="span" fontWeight="medium" sx={usernameLinkStyle}>
                                                                {referrer.referrerUsername}
                                                            </Text>
                                                        </Link>
                                                        <Badge colorScheme="purple" ml={1}>
                                                            {referrer.count} referral{referrer.count !== 1 ? 's' : ''}
                                                        </Badge>
                                                    </HStack>
                                                    <IconButton
                                                        aria-label="Copy ID"
                                                        icon={<CopyIcon color="white" />}
                                                        size="xs"
                                                        variant="solid"
                                                        bg="purple.500"
                                                        _hover={{ bg: "purple.600" }}
                                                        onClick={() => copyToClipboard(referrer.referrerId)}
                                                    />
                                                </Flex>
                                                
                                                <Flex direction="column" ml={4} mt={1} gap={1}>
                                                    {referrer.referredUsers.map((user) => (
                                                        <Flex key={user.userId} justify="space-between" fontSize="sm">
                                                            <Link 
                                                                href={`/profile/${user.userId}`} 
                                                                target="_blank" 
                                                                passHref
                                                            >
                                                                <Text as="span" sx={usernameLinkStyle}>
                                                                    {user.username}
                                                                </Text>
                                                            </Link>
                                                            <IconButton
                                                                aria-label="Copy ID"
                                                                icon={<CopyIcon color="white" />}
                                                                size="xs"
                                                                variant="solid"
                                                                bg="purple.500"
                                                                _hover={{ bg: "purple.600" }}
                                                                onClick={() => copyToClipboard(user.userId)}
                                                            />
                                                        </Flex>
                                                    ))}
                                                </Flex>
                                            </Box>
                                        ))}
                                    </Flex>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Flex>
            
            {/* Active Games Table */}
            <Heading size="md" mb="1rem" color="white">Active Games</Heading>
            <Box
                w="100%"
                p="1.5rem"
                bg="blackAlpha.500"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
            >
                {activeGames === undefined ? (
                    <Spinner />
                ) : activeGames.length === 0 ? (
                    <Text color="white">No active games found</Text>
                ) : (
                    <Flex direction="column" w="100%" h="500px" position="relative">
                        <Box overflowX="auto" w="100%" flex="1" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">GAME ID</Th>
                                        <Th color="purple.100" fontWeight="bold">Mode</Th>
                                        <Th color="purple.100" fontWeight="bold">Blinds</Th>
                                        <Th color="purple.100" fontWeight="bold">Host</Th>
                                        <Th color="purple.100" fontWeight="bold">Players</Th>
                                        <Th color="purple.100" fontWeight="bold">Revenue</Th>
                                        <Th color="purple.100" fontWeight="bold">Last Update</Th>
                                        <Th color="purple.100" fontWeight="bold">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedGames.map((game) => (
                                        <Tr key={game._id}>
                                            <Td color="gray.300">
                                                <HStack spacing="2" justifyContent="space-between">
                                                    {!isPortrait && <Text>{truncateId(game._id)}</Text>}
                                                    <Tooltip label="Copy full ID">
                                                        <IconButton
                                                            aria-label="Copy ID"
                                                            icon={<CopyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => copyToClipboard(game._id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
                                                {getGameMode(game.gameData)}
                                            </Td>
                                            <Td color="white">
                                                {formatBlinds(game.gameData)}
                                            </Td>
                                            <Td color="white">
                                                {game.gameData?.game_host === "ADMIN" ? (
                                                    <Text color="yellow.300">SYSTEM</Text>
                                                ) : (
                                                    <Link href={`/profile/${game.gameData?.game_host}`} target="_blank" passHref>
                                                        <Text as="span" sx={usernameLinkStyle}>
                                                            {game.hostUsername || truncateId(game.gameData?.game_host || "")}
                                                        </Text>
                                                    </Link>
                                                )}
                                            </Td>
                                            <Td color="white" textAlign="center">
                                                {formatPlayerCount(game.gameData)}
                                            </Td>
                                            <Td color="white">
                                                <Text textAlign="right" fontWeight="bold">{formatRevenue(game.revenue)}</Text>
                                            </Td>
                                            <Td color="gray.300">{formatDate(game.updatedAt)}</Td>
                                            <Td>
                                                <HStack spacing={2} justifyContent="space-between">
                                                    <Tooltip label="Search Game">
                                                        <IconButton
                                                            aria-label="Search Game"
                                                            icon={<MagnifyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => handleQuickSearch(game._id)}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="View Game">
                                                        <Link href={`/poker/${game._id}`} target="_blank" passHref>
                                                            <IconButton
                                                                as="span"
                                                                aria-label="View Game"
                                                                icon={<ViewIcon color="white" />}
                                                                size="xs"
                                                                variant="solid"
                                                                bg="blue.500"
                                                                _hover={{ bg: "blue.600" }}
                                                            />
                                                        </Link>
                                                    </Tooltip>
                                                    {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && !game.archived && (
                                                        <Tooltip label="Archive Game">
                                                            <IconButton
                                                                aria-label="Archive Game"
                                                                icon={<FaArchive color="white" />}
                                                                size="xs"
                                                                variant="solid"
                                                                bg="red.500"
                                                                _hover={{ bg: "red.600" }}
                                                                isLoading={archivingGameId === game._id}
                                                                onClick={() => handleArchiveGame(game._id)}
                                                                isDisabled={Date.now() - new Date(game.updatedAt).getTime() < 12 * 60 * 60 * 1000 || (game.gameData?.game_state !== 0 && game.gameData?.game_state !== null && game.gameData?.game_state !== undefined)}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </HStack>
                                            </Td>
                                            <Td>
                                                {game.archived && (
                                                    <Badge colorScheme="red">Archived</Badge>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        
                        {/* Pagination Controls */}
                        <HStack mt="auto" pt={4} pb={2} justifyContent="center" spacing={4}>
                            <IconButton
                                aria-label="Previous Page"
                                icon={<ChevronLeftIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handlePrevPage}
                                isDisabled={currentPage === 0}
                            />
                            <Text color="white">
                                Page {currentPage + 1}
                            </Text>
                            <IconButton
                                aria-label="Next Page"
                                icon={<ChevronRightIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handleNextPage}
                                isDisabled={!canClickNext}
                            />
                        </HStack>
                    </Flex>
                )}
            </Box>

            {/* Game History Table */}
            <Heading size="md" mt="2rem" mb="1rem" color="white">Game History</Heading>
            <Box
                w="100%"
                p="1.5rem"
                bg="brand.gray60"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
            >
                {historyLoading ? (
                    <Spinner />
                ) : historyGames.length === 0 ? (
                    <Text color="white">No games with revenue over $1 found</Text>
                ) : (
                    <Flex direction="column" w="100%" h="500px" position="relative">
                        <Box overflowX="auto" w="100%" flex="1" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">ID</Th>
                                        <Th color="purple.100" fontWeight="bold">Type</Th>
                                        <Th color="purple.100" fontWeight="bold">Blinds</Th>
                                        <Th color="purple.100" fontWeight="bold">Host</Th>
                                        <Th color="purple.100" fontWeight="bold">Referrals</Th>
                                        <Th color="purple.100" fontWeight="bold">Hands Played</Th>
                                        <Th color="purple.100" fontWeight="bold">Created</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {historyGames.map((game: any) => (
                                        <Tr key={game.id}>
                                            <Td color="gray.300">
                                                <HStack spacing="2" justifyContent="space-between">
                                                    {!isPortrait && <Text>{truncateId(game.id)}</Text>}
                                                    <Tooltip label="Copy full ID">
                                                        <IconButton
                                                            aria-label="Copy ID"
                                                            icon={<CopyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => copyToClipboard(game.id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white" textAlign="center">
                                                <Badge 
                                                    colorScheme={game.gameType === "NLH" ? "blue" : "green"}
                                                    fontSize="xs"
                                                >
                                                    {game.gameType || 'N/A'}
                                                </Badge>
                                            </Td>
                                            <Td color="white">{game.blinds || 'N/A'}</Td>
                                            <Td color="white">{game.host || 'N/A'}</Td>
                                            <Td color="white" textAlign="center">{game.referrals}</Td>
                                            <Td color="white" textAlign="center">{game.handsPlayed}</Td>
                                            <Td color="white">{formatDate(game.createdAt)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        {/* Pagination Controls */}
                        <HStack mt="auto" pt={4} pb={2} justifyContent="center" spacing={4}>
                            <IconButton
                                aria-label="Previous Page"
                                icon={<ChevronLeftIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handlePrevHistoryPage}
                                isDisabled={historyPage === 0 || historyLoading}
                            />
                            <Text color="white">
                                Page {historyPage + 1}
                            </Text>
                            <IconButton
                                aria-label="Next Page"
                                icon={<ChevronRightIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handleNextHistoryPage}
                                isDisabled={historyIsDone || historyLoading}
                            />
                        </HStack>
                    </Flex>
                )}
            </Box>

            {/* Game Statistics Tables */}
            <Heading size="md" mt="2rem" mb="1rem" color="white">Game Statistics</Heading>
            <Flex w="100%" gap={4} alignItems="flex-start" mb="2rem" direction={isPortrait ? "column" : "row"}>
                {/* Archived Games Count Table */}
                <Box
                    w={isPortrait ? "100%" : "50%"}
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                    p="1.5rem"
                >
                    <Heading size="sm" mb="1rem" color="white">Archived Games by Month</Heading>
                    <Text color="whiteAlpha.700" fontSize="sm" mb="1rem">
                        NLH vs PLO archived games count (2025)
                    </Text>
                    <Box maxH="400px" overflowY="auto">
                        <Table variant="unstyled" size="sm" color="white">
                            <Thead>
                                <Tr>
                                    <Th color="purple.100" fontWeight="bold">Month</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">NLH</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">PLO</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = i + 1;
                                    const monthKey = `2025-${month.toString().padStart(2, '0')}`;
                                    const nlhCount = gameStats?.[monthKey]?.nlh || 0;
                                    const ploCount = gameStats?.[monthKey]?.plo || 0;
                                    const total = nlhCount + ploCount;
                                    
                                    return (
                                        <Tr key={month} _hover={{ bg: "whiteAlpha.100" }}>
                                            <Td color="gray.300">
                                                {new Date(2025, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </Td>
                                            <Td color="blue.300" textAlign="center" fontWeight="bold">
                                                {nlhCount}
                                            </Td>
                                            <Td color="green.300" textAlign="center" fontWeight="bold">
                                                {ploCount}
                                            </Td>
                                            <Td color="white" textAlign="center" fontWeight="bold">
                                                {total}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>

                {/* Hands Played Table */}
                <Box
                    w={isPortrait ? "100%" : "50%"}
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                    p="1.5rem"
                >
                    <Heading size="sm" mb="1rem" color="white">Hands Played by Month</Heading>
                    <Text color="whiteAlpha.700" fontSize="sm" mb="1rem">
                        Total hands played in archived games per game mode (2025)
                    </Text>
                    <Box maxH="400px" overflowY="auto">
                        <Table variant="unstyled" size="sm" color="white">
                            <Thead>
                                <Tr>
                                    <Th color="purple.100" fontWeight="bold">Month</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">NLH Hands</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">PLO Hands</Th>
                                    <Th color="purple.100" fontWeight="bold" textAlign="center">Total</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = i + 1;
                                    const monthKey = `2025-${month.toString().padStart(2, '0')}`;
                                    const nlhHands = archivedGameStats?.[monthKey]?.nlhHands || 0;
                                    const ploHands = archivedGameStats?.[monthKey]?.ploHands || 0;
                                    const total = nlhHands + ploHands;
                                    
                                    return (
                                        <Tr key={month} _hover={{ bg: "whiteAlpha.100" }}>
                                            <Td color="gray.300">
                                                {new Date(2025, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </Td>
                                            <Td color="purple.300" textAlign="center" fontWeight="bold">
                                                {nlhHands.toLocaleString()}
                                            </Td>
                                            <Td color="orange.300" textAlign="center" fontWeight="bold">
                                                {ploHands.toLocaleString()}
                                            </Td>
                                            <Td color="white" textAlign="center" fontWeight="bold">
                                                {total.toLocaleString()}
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
            </Flex>

            {/* Hand History Section */}
            <Heading size="md" mt="2rem" mb="1rem" color="white">Hand History</Heading>
            <Flex w="100%" gap={4} alignItems="flex-start" mb="2rem" direction={isPortrait ? "column" : "row"}>
                {/* Search Form Container */}
                <Box
                    w={isPortrait ? "100%" : "50%"}
                    bg="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%), #344182"
                    border="0.1rem solid"
                    borderColor="purple.400"
                    p={6}
                    borderRadius="16px"
                    boxShadow="lg"
                >
                    <Heading size="sm" mb="1rem" color="white">Search Hand History</Heading>
                    <form onSubmit={handleHandHistorySearch}>
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <FormLabel htmlFor="handGameId" fontSize="sm" fontWeight="medium" color="purple.100">
                                    Game ID
                                </FormLabel>
                                <Input
                                    id="handGameId"
                                    bg="gray.900"
                                    color="white"
                                    value={handHistoryGameId}
                                    onChange={(e) => setHandHistoryGameId(e.target.value)}
                                    placeholder="Enter game ID"
                                    _placeholder={{ color: 'gray.400' }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="handNumber" fontSize="sm" fontWeight="medium" color="purple.100">
                                    Hand Number
                                </FormLabel>
                                <Input
                                    id="handNumber"
                                    bg="gray.900"
                                    color="white"
                                    value={handHistoryNumber}
                                    onChange={(e) => setHandHistoryNumber(e.target.value)}
                                    placeholder="Enter hand number (e.g. 123)"
                                    _placeholder={{ color: 'gray.400' }}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                bg="blue.500"
                                _hover={{ bg: "blue.600" }}
                                isDisabled={handHistorySubmitted && handHistoryLogs === undefined}
                                w="100%"
                            >
                                {(handHistorySubmitted && handHistoryLogs === undefined) ? <Spinner size="sm" color="white" /> : <MagnifyIcon color="white" />}
                            </Button>
                        </VStack>
                    </form>
                    {handHistoryError && (
                        <Box mt={3} bg="red.100" color="red.800" p={2} borderRadius="md">
                            {handHistoryError}
                        </Box>
                    )}
                </Box>
                {/* Results Box */}
                <Box
                    w={isPortrait ? "100%" : "50%"}
                    bg="rgb(15, 15, 15, 0.9)"
                    borderRadius="16px"
                    boxShadow="lg"
                    minHeight="200px"
                    maxHeight={isPortrait ? "400px" : "350px"}
                    overflowY="auto"
                    p={4}
                >
                    {handHistorySubmitted && handHistoryLogs === undefined ? (
                        <Spinner />
                    ) : handHistoryLogs && handHistoryLogs.length > 0 ? (
                        <VStack align="start" spacing={2}>
                            {handHistoryLogs.flatMap((log: any) => {
                                if (log.logType === LogType.PLAYERS) {
                                    // renderPlayersLog returns an array of LogMessages, each with the parent log's _id as key
                                    let players = [];
                                    try {
                                        players = JSON.parse(log.args[0]);
                                    } catch (e) {
                                        return null;
                                    }
                                    return players.map((player: any, idx: any) => (
                                        <LogMessage key={`${log._id}-${player.player_id}`} log={{
                                            ...log,
                                            args: [
                                                player.player_id,
                                                player.index,
                                                player.amount,
                                                player.is_dealer,
                                                player.is_small_blind,
                                                player.is_big_blind,
                                            ],
                                        }} />
                                    ));
                                } else if (log.logType !== LogType.HAND_START) {
                                    return <LogMessage key={log._id} log={log as Doc<'gameLogs'>}/>;
                                }
                            })}
                        </VStack>
                    ) : handHistorySubmitted ? (
                        <Text color="gray.400">No hand history found.</Text>
                    ) : null}
                </Box>
            </Flex>
        </Box>
    );
};

export default Games;
