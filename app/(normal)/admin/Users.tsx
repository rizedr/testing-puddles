'use client';

import {
    VStack,
    Text,
    Box,
    Input,
    Button,
    Select,
    Flex,
    FormControl,
    FormLabel,
    useToast,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    StatHelpText,
    Divider,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    IconButton,
    Tooltip,
    Spinner,
    Heading,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';
import useViewer from '../../../components/hooks/useViewer';
import { CopyIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const Users = () => {
    const [userId, setUserId] = useState('');
    const [userIdToSearch, setUserIdToSearch] = useState<Id<'users'> | null>(null);
    const [userRole, setUserRole] = useState<'USER' | 'MODERATOR' | 'ADMIN'>('USER');
    const [originalRole, setOriginalRole] = useState<'USER' | 'MODERATOR' | 'ADMIN'>('USER');
    const [invalidUserId, setInvalidUserId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const toast = useToast();
    const { isAdmin } = useViewer();
    const [affiliateRate, setAffiliateRate] = useState(0.1);
    const [affiliateDuration, setAffiliateDuration] = useState(90);
    const [selectedHostUser, setSelectedHostUser] = useState<Id<'users'> | null>(null);

    // Get user statistics
    const userStats = useQuery(api.users.getUserStatistics);

    const userInfo = useQuery(
        api.users.getUserById,
        userIdToSearch ? { userId: userIdToSearch } : 'skip'
    );

    // Get lifetime host rewards data
    const hostRewardsData = useQuery(api.tasks.getLifetimeHostRewards);

    // Get detailed host rewards for selected user
    const detailedHostRewards = useQuery(
        api.tasks.getHostRewards,
        selectedHostUser ? { userId: selectedHostUser } : 'skip'
    );

    const updateUserRole = useMutation(api.users.updateUserRole);
    const assignAffiliate = useMutation(api.users.assignAffiliate);
    const removeAffiliate = useMutation(api.users.removeAffiliate);
    const refreshHostRewards = useMutation(api.tasks.refreshAllHostRewards);
    const rollupHostRewards = useMutation(api.tasks.rollupHostRewards);

    const handleSearch = () => {
        try {
            setIsSearching(true);
            if (!userId.trim()) {
                toast({
                    title: 'User ID required',
                    status: 'error',
                    duration: 3000,
                });
                setIsSearching(false);
                return;
            }
            
            setInvalidUserId(null);
            const validUserId = userId as Id<'users'>;
            setUserIdToSearch(validUserId);
            
            // Set default values for affiliate rate and duration
            setAffiliateRate(0.1);
            setAffiliateDuration(90);
            
            setIsSearching(false);
        } catch (error) {
            setInvalidUserId(userId);
            setUserIdToSearch(null);
            toast({
                title: 'Invalid User ID format',
                status: 'error',
                duration: 3000,
            });
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (userInfo) {
            const role = userInfo.role as 'USER' | 'MODERATOR' | 'ADMIN' || 'USER';
            setUserRole(role);
            setOriginalRole(role);
        }
    }, [userInfo]);

    const handleRoleUpdate = async () => {
        if (!userIdToSearch) return;
        
        try {
            await updateUserRole({ 
                userId: userIdToSearch, 
                role: userRole 
            });
            
            toast({
                title: 'User role updated',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Failed to update user role',
                description: (error as Error).message,
                status: 'error',
                duration: 3000,
            });
        }
    };
    
    // Format date helper function
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatAmount = (amount: bigint) => {
        const amountNumber = Number(amount) / 1000000;
        return `$${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    const formatMonth = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const truncateUserId = (userId: string) => {
        if (userId.length <= 8) return userId;
        return `${userId.slice(0, 4)}...${userId.slice(-4)}`;
    };

    const groupHostRewardsByMonth = (rewards: any[]) => {
        const monthlyData: Record<string, { amount: bigint; games: number }> = {};
        
        rewards.forEach(reward => {
            const monthKey = formatMonth(reward.date);
            
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].amount += reward.amount;
                monthlyData[monthKey].games += 1;
            } else {
                monthlyData[monthKey] = {
                    amount: reward.amount,
                    games: 1
                };
            }
        });
        
        return Object.entries(monthlyData)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
    };

    const [isRefreshingHostRewards, setIsRefreshingHostRewards] = useState(false);
    const [isRollingUpHostRewards, setIsRollingUpHostRewards] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const handleRefreshHostRewards = async () => {
        setIsRefreshingHostRewards(true);
        try {
            await refreshHostRewards({});
            toast({
                title: "Host rewards refreshed",
                description: "All host rewards have been recalculated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Refresh failed",
                description: "Failed to refresh host rewards data",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsRefreshingHostRewards(false);
        }
    };

    const handleRollupHostRewards = async () => {
        setIsRollingUpHostRewards(true);
        try {
            await rollupHostRewards({});
            toast({
                title: "Rollup complete",
                description: "Host rewards have been rolled up.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Rollup failed",
                description: "Failed to roll up host rewards",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsRollingUpHostRewards(false);
        }
    };

    const handleAffiliateToggle = async () => {
        if (!userIdToSearch || !userInfo || !isAdmin) return;
        
        try {
            if (userInfo.affiliate) {
                await removeAffiliate({ userId: userIdToSearch });
                toast({
                    title: 'Affiliate status removed',
                    status: 'success',
                    duration: 3000,
                });
            } else {
                // Only pass rate and duration if they are valid numbers
                const params: {
                    userId: Id<'users'>,
                    rate?: number,
                    duration?: number
                } = { userId: userIdToSearch };
                
                // Only add rate if it's a valid number between 0 and 1
                if (!isNaN(affiliateRate) && affiliateRate > 0 && affiliateRate < 1) {
                    params.rate = affiliateRate;
                }
                
                // Only add duration if it's a valid positive number
                if (!isNaN(affiliateDuration) && affiliateDuration > 0) {
                    params.duration = affiliateDuration;
                }
                
                await assignAffiliate(params);
                toast({
                    title: 'Affiliate status assigned',
                    status: 'success',
                    duration: 3000,
                });
            }
            
            // Refresh user data
            setUserIdToSearch(userIdToSearch);
        } catch (error) {
            toast({
                title: 'Failed to update affiliate status',
                description: (error as Error).message,
                status: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <VStack w="100%" spacing="1.5rem" align="start">
            {/* User Statistics Section */}
            {isPortrait ? (
                <VStack w="100%" gap="1rem">
                    {/* Total Users */}
                    <Box 
                        w="100%"
                        bg="blackAlpha.600" 
                        borderRadius="16px" 
                        p="1.5rem" 
                        border="0.1rem solid" 
                        borderColor="purple.400"
                    >
                        <Stat>
                            <StatLabel color="whiteAlpha.700" fontSize="lg">Total Users</StatLabel>
                            <StatNumber color="white" fontSize="3xl">{userStats?.total.userCount || 0}</StatNumber>
                            {/* <StatHelpText color="whiteAlpha.600">
                                Since {userStats ? formatDate(userStats.firstUserDate) : 'N/A'}
                            </StatHelpText> */}
                        </Stat>
                    </Box>

                    {/* Weekly and Monthly Stats - Side by side in portrait */}
                    <Flex w="100%" gap="1rem">
                        {/* Weekly Stats */}
                        <Box 
                            flex="1" 
                            bg="blackAlpha.500" 
                            borderRadius="16px" 
                            p="1.5rem" 
                            border="0.1rem solid" 
                            borderColor="purple.400"
                        >
                            <Text color="whiteAlpha.700" fontSize="lg">Weekly Activity</Text>
                            <StatGroup mt="2">
                                <Stat>
                                    <StatLabel color="whiteAlpha.600">New Users</StatLabel>
                                    <StatNumber color="white" fontSize="2xl">{userStats?.weekly.newUserCount || 0}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel color="whiteAlpha.600">Active Users</StatLabel>
                                    <StatNumber color="white" fontSize="2xl">{userStats?.weekly.activeUserCount || 0}</StatNumber>
                                </Stat>
                            </StatGroup>
                        </Box>

                        {/* Monthly Stats */}
                        <Box 
                            flex="1" 
                            bg="blackAlpha.500" 
                            borderRadius="16px" 
                            p="1.5rem" 
                            border="0.1rem solid" 
                            borderColor="purple.400"
                        >
                            <Text color="whiteAlpha.700" fontSize="lg">Monthly Activity</Text>
                            <StatGroup mt="2">
                                <Stat>
                                    <StatLabel color="whiteAlpha.600">New Users</StatLabel>
                                    <StatNumber color="white" fontSize="2xl">{userStats?.monthly.newUserCount || 0}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel color="whiteAlpha.600">Active Users</StatLabel>
                                    <StatNumber color="white" fontSize="2xl">{userStats?.monthly.activeUserCount || 0}</StatNumber>
                                </Stat>
                            </StatGroup>
                        </Box>
                    </Flex>
                </VStack>
            ) : (
                <Flex w="100%" gap="1rem">
                    {/* Total Users */}
                    <Box 
                        flex="1"
                        bg="blackAlpha.600" 
                        borderRadius="16px" 
                        p="1.5rem" 
                        border="0.1rem solid" 
                        borderColor="purple.400"
                    >
                        <Stat>
                            <StatLabel color="whiteAlpha.700" fontSize="lg">Total Users</StatLabel>
                            <StatNumber color="white" fontSize="3xl">{userStats?.total.userCount || 0}</StatNumber>
                            {/* <StatHelpText color="whiteAlpha.600">
                                Since {userStats ? formatDate(userStats.firstUserDate) : 'N/A'}
                            </StatHelpText> */}
                        </Stat>
                    </Box>

                    {/* Weekly Stats */}
                    <Box 
                        flex="1" 
                        bg="blackAlpha.500" 
                        borderRadius="16px" 
                        p="1.5rem" 
                        border="0.1rem solid" 
                        borderColor="purple.400"
                    >
                        <Text color="whiteAlpha.700" fontSize="lg">Weekly Activity</Text>
                        <StatGroup mt="2">
                            <Stat>
                                <StatLabel color="whiteAlpha.600">New Users</StatLabel>
                                <StatNumber color="white" fontSize="2xl">{userStats?.weekly.newUserCount || 0}</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel color="whiteAlpha.600">Active Users</StatLabel>
                                <StatNumber color="white" fontSize="2xl">{userStats?.weekly.activeUserCount || 0}</StatNumber>
                            </Stat>
                        </StatGroup>
                    </Box>

                    {/* Monthly Stats */}
                    <Box 
                        flex="1" 
                        bg="blackAlpha.500" 
                        borderRadius="16px" 
                        p="1.5rem" 
                        border="0.1rem solid" 
                        borderColor="purple.400"
                    >
                        <Text color="whiteAlpha.700" fontSize="lg">Monthly Activity</Text>
                        <StatGroup mt="2">
                            <Stat>
                                <StatLabel color="whiteAlpha.600">New Users</StatLabel>
                                <StatNumber color="white" fontSize="2xl">{userStats?.monthly.newUserCount || 0}</StatNumber>
                            </Stat>
                            <Stat>
                                <StatLabel color="whiteAlpha.600">Active Users</StatLabel>
                                <StatNumber color="white" fontSize="2xl">{userStats?.monthly.activeUserCount || 0}</StatNumber>
                            </Stat>
                        </StatGroup>
                    </Box>
                </Flex>
            )}

            {/* Divider between stats and user management */}
            <Divider borderColor="whiteAlpha.300" />

            {/* Combined User Management Section */}
            <VStack
                w="100%"
                spacing="1.5rem"
                align="start"
                bg="brand.gray60"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
                p="1.5rem"
            >
                <Text fontSize="xl" fontWeight="bold" color="white">
                    User Management
                </Text>
                
                <Flex w="100%" gap="1rem">
                    <Input
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        color="white"
                        flex="1"
                        bg="whiteAlpha.100"
                    />
                    <Button 
                        colorScheme="purple" 
                        onClick={handleSearch}
                        isLoading={isSearching}
                        loadingText="Searching"
                    >
                        Search
                    </Button>
                </Flex>
                
                {invalidUserId && (
                    <Box w="100%" bg="whiteAlpha.100" p="1rem" borderRadius="md">
                        <Text color="red.300">
                            Invalid User ID: {invalidUserId}
                        </Text>
                    </Box>
                )}
                
                {userIdToSearch && !userInfo && !invalidUserId && (
                    <Box w="100%" bg="red.100" p="1rem" borderRadius="md">
                        <Text color="red.700">
                            User not found with ID: {userIdToSearch}
                        </Text>
                    </Box>
                )}
                
                {userInfo && (
                    <Box 
                        w="100%" 
                        bg="brand.primaryGray" 
                        p="1rem" 
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.500"
                    >
                        <VStack align="start" spacing="1rem" width="100%">
                            <Text color="white">
                                <strong>User ID:</strong> {userInfo._id}
                            </Text>
                            <Text color="white">
                                <strong>Username:</strong> {userInfo.username}
                            </Text>
                            
                            {/* User Role Management */}
                            <Divider borderColor="whiteAlpha.300" />
                            <Text color="purple.200" fontWeight="semibold">Role Management</Text>
                            
                            <FormControl>
                                <FormLabel color="white">Role</FormLabel>
                                <Select 
                                    value={userRole}
                                    onChange={(e) => setUserRole(e.target.value as 'USER' | 'MODERATOR' | 'ADMIN')}
                                    color="white"
                                    bg="whiteAlpha.200"
                                >
                                    <option value="USER">User</option>
                                    <option value="MODERATOR">Moderator</option>
                                    <option value="ADMIN">Admin</option>
                                </Select>
                            </FormControl>
                            
                            <Button 
                                colorScheme="purple" 
                                onClick={handleRoleUpdate}
                                alignSelf="flex-end"
                                isDisabled={!isAdmin || userRole === originalRole}
                                _disabled={{
                                    opacity: 0.6,
                                    cursor: 'not-allowed',
                                }}
                            >
                                Update Role
                            </Button>
                            
                            {/* Affiliate Management */}
                            <Divider borderColor="whiteAlpha.300" />
                            <Text color="purple.200" fontWeight="semibold">Affiliate Management</Text>
                            
                            <Flex color="white" alignItems="center">
                                <Text>Status:</Text>
                                <Box ml="2">
                                    {userInfo.affiliate ? (
                                        <Badge colorScheme="green" fontWeight="bold">Active</Badge>
                                    ) : (
                                        <Text as="span" fontWeight="bold">Inactive</Text>
                                    )}
                                </Box>
                            </Flex>
                            
                            {userInfo.affiliate ? (
                                <>
                                    <Text color="white">
                                        <strong>Code:</strong> {userInfo.affiliate.code}
                                    </Text>
                                    <Text color="white">
                                        <strong>Rate:</strong> {userInfo.affiliate.rate} ({(userInfo.affiliate.rate * 100).toFixed(0)}%)
                                    </Text>
                                    <Text color="white">
                                        <strong>Duration:</strong> {userInfo.affiliate.duration} days
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <FormControl>
                                        <FormLabel color="white">Rate (0-1)</FormLabel>
                                        <Input
                                            type="number"
                                            value={affiliateRate}
                                            onChange={(e) => setAffiliateRate(parseFloat(e.target.value))}
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            color="white"
                                            bg="whiteAlpha.200"
                                        />
                                    </FormControl>
                                    
                                    <FormControl>
                                        <FormLabel color="white">Duration (days)</FormLabel>
                                        <Input
                                            type="number"
                                            value={affiliateDuration}
                                            onChange={(e) => setAffiliateDuration(parseInt(e.target.value))}
                                            min={1}
                                            color="white" 
                                            bg="whiteAlpha.200"
                                        />
                                    </FormControl>
                                </>
                            )}
                            
                            <Button 
                                colorScheme={userInfo.affiliate ? "red" : "green"}
                                onClick={handleAffiliateToggle}
                                alignSelf="flex-end"
                                isDisabled={!isAdmin}
                                _disabled={{
                                    opacity: 0.6,
                                    cursor: 'not-allowed',
                                }}
                            >
                                {userInfo.affiliate ? 'Remove Affiliate' : 'Assign Affiliate'}
                            </Button>
                            
                            {!isAdmin && (
                                <Text color="red.300" fontSize="sm">
                                    Only admins can manage user roles and affiliate status
                                </Text>
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>

            {/* Host Rewards Table */}
            <Box w="100%">
                <Text fontSize="xl" fontWeight="bold" color="white" textAlign="left" mb="1rem">
                    All-Time Poker Host Rewards
                </Text>
                <Box
                    w="100%"
                    p="1.5rem"
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                >
                    <Flex justify="space-between" align="center" mb="1rem">
                        <HStack>
                            <Button
                                onClick={handleRefreshHostRewards}
                                isLoading={isRefreshingHostRewards}
                                loadingText="Refreshing..."
                                size="sm"
                                fontSize="xs"
                                bg="purple.700"
                                color="white"
                                _hover={{ bg: "purple.800" }}
                                _active={{ bg: "purple.900" }}
                            >
                                1. Refresh
                            </Button>
                            <Button
                                onClick={handleRollupHostRewards}
                                isLoading={isRollingUpHostRewards}
                                loadingText="Rolling Up..."
                                size="sm"
                                fontSize="xs"
                                bg="purple.700"
                                color="white"
                                _hover={{ bg: "purple.800" }}
                                _active={{ bg: "purple.900" }}
                            >
                                2. Roll Up
                            </Button>
                        </HStack>
                    </Flex>
                    {hostRewardsData === undefined ? (
                        <Spinner color="white" />
                    ) : hostRewardsData.length === 0 ? (
                        <Text color="white">No host rewards found</Text>
                    ) : (
                        <Box overflowX="auto" maxH="400px" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">Username</Th>
                                        <Th color="purple.100" fontWeight="bold">ID</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="center">Games Hosted</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">Total Earnings</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {hostRewardsData.map((hostData) => (
                                        <Tr 
                                            key={hostData.userId}
                                            cursor="pointer"
                                            _hover={{ bg: "purple.900" }}
                                            onClick={() => setSelectedHostUser(selectedHostUser === hostData.userId ? null : hostData.userId)}
                                        >
                                            <Td color="white">
                                                <Link href={`/profile/${hostData.userId}`} target="_blank" passHref>
                                                    <Text as="span" sx={usernameLinkStyle} fontWeight="bold">
                                                        {hostData.username}
                                                    </Text>
                                                </Link>
                                            </Td>
                                            <Td color="white" w={isPortrait ? "60px" : "200px"}>
                                                <HStack spacing="2" justify="space-between">
                                                    {!isPortrait && (
                                                        <Text fontSize="sm" fontFamily="mono">{hostData.userId}</Text>
                                                    )}
                                                    <Tooltip label="Copy User ID">
                                                        <IconButton
                                                            icon={<CopyIcon />}
                                                            size="xs"
                                                            variant="ghost"
                                                            color="white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(hostData.userId);
                                                            }}
                                                            aria-label="Copy User ID"
                                                            _hover={{ bg: "purple.500" }}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white" textAlign="center">
                                                {hostData.totalGames}
                                            </Td>
                                            <Td color="white" textAlign="right" fontWeight="bold">
                                                {formatAmount(hostData.totalAmount)}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}

                    {/* Monthly Breakdown Section */}
                    {selectedHostUser && detailedHostRewards && (
                        <Box mt={6}>
                            <Divider borderColor="whiteAlpha.300" mb={4} />
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading size="sm" color="gray.300">
                                    Monthly Breakdown - {hostRewardsData?.find(h => h.userId === selectedHostUser)?.username}
                                </Heading>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    color="whiteAlpha.700"
                                    onClick={() => setSelectedHostUser(null)}
                                    _hover={{ bg: "whiteAlpha.100", color: "whiteAlpha.900" }}
                                >
                                    Close
                                </Button>
                            </Flex>
                            
                            <Box
                                maxH="400px"
                                overflowY="auto"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                borderRadius="md"
                                bg="rgba(0, 0, 0, 0.3)"
                            >
                                {detailedHostRewards.length > 0 ? (
                                    <Table variant="unstyled" size="sm" color="white">
                                        <Thead position="sticky" top={0} bg="brand.gray60" zIndex={1}>
                                            <Tr>
                                                <Th color="purple.100" fontWeight="bold">Month</Th>
                                                <Th color="purple.100" fontWeight="bold" textAlign="center">Games</Th>
                                                <Th color="purple.100" fontWeight="bold" textAlign="right">Amount</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {groupHostRewardsByMonth(detailedHostRewards).map(([month, data]) => (
                                                <Tr key={month} _hover={{ bg: "whiteAlpha.100" }}>
                                                    <Td color="gray.300">
                                                        {month}
                                                    </Td>
                                                    <Td color="white" textAlign="center">
                                                        {data.games}
                                                    </Td>
                                                    <Td color="green.400" fontWeight="bold" textAlign="right">
                                                        {formatAmount(data.amount)}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                ) : (
                                    <Box p={4} textAlign="center">
                                        <Text color="whiteAlpha.600">
                                            No detailed host rewards found for this user
                                        </Text>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};

export default Users;
