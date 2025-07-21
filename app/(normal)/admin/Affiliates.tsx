'use client';

import {
    VStack,
    Text,
    Box,
    Input,
    Button,
    Flex,
    FormControl,
    FormLabel,
    useToast,
    Stat,
    StatLabel,
    StatNumber,
    Divider,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    Tooltip,
    Spinner,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';
import useViewer from '../../../components/hooks/useViewer';
import { CopyIcon } from '@chakra-ui/icons';
import { SearchIcon as MagnifyIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const useSafeUserQuery = (userId: Id<'users'> | null) => {
    const [userInfo, setUserInfo] = useState<any>(undefined);
    const [hasError, setHasError] = useState(false);

    // Only make the query if we have a valid-looking userId
    const shouldQuery = userId && /^[a-zA-Z0-9]{25,}$/.test(userId);
    
    const queryResult = useQuery(
        api.users.getUserById,
        shouldQuery ? { userId } : 'skip'
    );

    useEffect(() => {
        if (!userId) {
            setUserInfo(undefined);
            setHasError(false);
            return;
        }

        if (!shouldQuery) {
            setUserInfo(null);
            setHasError(true);
            return;
        }

        if (queryResult !== undefined) {
            setUserInfo(queryResult);
            setHasError(false);
        }
    }, [userId, queryResult, shouldQuery]);

    return { userInfo, hasError };
};

const Affiliates = () => {
    const [userId, setUserId] = useState('');
    const [userIdToSearch, setUserIdToSearch] = useState<Id<'users'> | null>(null);
    const [invalidUserId, setInvalidUserId] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [newReferralUserId, setNewReferralUserId] = useState('');
    const [isAddingReferral, setIsAddingReferral] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);
    const toast = useToast();
    const { isAdmin } = useViewer();

    const { userInfo, hasError } = useSafeUserQuery(userIdToSearch);

    const referrals = useQuery(
        api.referral.getReferrals,
        userIdToSearch && userInfo?.affiliate ? { affiliateUserId: userIdToSearch } : 'skip'
    );

    const referredUserIds = referrals?.map(r => r.referredUserId) || [];
    const referredUsers = useQuery(
        api.users.batchGetUsers,
        referredUserIds.length > 0 ? { userIds: referredUserIds } : 'skip'
    );

    const addUserToAffiliate = useMutation(api.users.addUserToAffiliate);

    // Get all affiliates data
    const allAffiliates = useQuery(api.users.getAllAffiliates);
    
    // Get referrals by month data
    const referralsByMonth = useQuery(api.tasks.getReferralsByMonth);

    // Handle user search result - set userNotFound when we have a search ID but no user info
    useEffect(() => {
        if (userIdToSearch && (hasError || userInfo === null)) {
            setUserNotFound(true);
        } else {
            setUserNotFound(false);
        }
    }, [userIdToSearch, userInfo, hasError]);

    const handleSearch = () => {
        setIsSearching(true);
        setInvalidUserId(null);
        setUserNotFound(false);
        
        if (!userId.trim()) {
            toast({
                title: 'User ID required',
                status: 'error',
                duration: 3000,
            });
            setIsSearching(false);
            return;
        }
        
        // Set the user ID to search for - let the query handle validation and errors
        const validUserId = userId as Id<'users'>;
        setUserIdToSearch(validUserId);
        setIsSearching(false);
    };

    const handleAddReferral = async () => {
        if (!userIdToSearch || !newReferralUserId.trim()) {
            toast({
                title: 'Both affiliate and referral user IDs are required',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        try {
            setIsAddingReferral(true);
            await addUserToAffiliate({
                affiliateUserId: userIdToSearch,
                referredUserId: newReferralUserId as Id<'users'>,
            });
            
            toast({
                title: 'Referral added successfully',
                status: 'success',
                duration: 3000,
            });
            
            setNewReferralUserId('');
        } catch (error) {
            toast({
                title: 'Failed to add referral',
                description: (error as Error).message,
                status: 'error',
                duration: 5000,
            });
        } finally {
            setIsAddingReferral(false);
        }
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
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount: bigint) => {
        const amountNumber = Number(amount) / 1000000;
        return `$${amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const isExpired = (expiresAt: number) => {
        return Date.now() > expiresAt;
    };

    const getTotalEarnings = () => {
        if (!referrals) return 0n;
        return referrals.reduce((total, referral) => total + referral.amountEarned, 0n);
    };

    const getUsernameById = (userId: Id<'users'>) => {
        return referredUsers?.find(user => user?._id === userId)?.username || 'Unknown';
    };

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    const truncateId = (id: string) => {
        if (!id) return '';
        return `${id.slice(0, 4)}...${id.slice(-4)}`;
    };

    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <VStack w="100%" spacing="1.5rem" align="start">
            {/* Search Section - Full width in portrait mode */}
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
                    Search Affiliate
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
                
                {userNotFound && (
                    <Box w="100%" bg="whiteAlpha.100" p="1rem" borderRadius="md">
                        <Text color="red.300">
                            User not found with ID: {userIdToSearch}
                        </Text>
                    </Box>
                )}
            </VStack>

            {/* Affiliate Info and Referrals - Side by side in landscape, stacked in portrait */}
            {userInfo && (
                <Flex w="100%" gap="1.5rem" direction={isPortrait ? "column" : "row"}>
                    {/* Affiliate Info Section */}
                    <VStack w={isPortrait ? "100%" : "50%"} spacing="1.5rem" align="start">
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
                                User Information
                            </Text>
                            
                            <VStack align="start" spacing="1rem" w="100%">
                                <HStack>
                                    <Text color="white">
                                        <strong>Username:</strong> {userInfo.username}
                                    </Text>
                                </HStack>
                                
                                <HStack>
                                    <Text color="white">
                                        <strong>User ID:</strong> {userInfo._id}
                                    </Text>
                                    <Tooltip label="Copy User ID">
                                        <IconButton
                                            icon={<CopyIcon />}
                                            size="sm"
                                            variant="ghost"
                                            color="white"
                                            onClick={() => copyToClipboard(userInfo._id)}
                                            aria-label="Copy User ID"
                                        />
                                    </Tooltip>
                                </HStack>
                                
                                <Flex alignItems="center">
                                    <Text color="white" mr="2">
                                        <strong>Affiliate Status:</strong>
                                    </Text>
                                    {userInfo.affiliate ? (
                                        <Badge colorScheme="green" fontWeight="bold">Active</Badge>
                                    ) : (
                                        <Badge colorScheme="red" fontWeight="bold">Not an Affiliate</Badge>
                                    )}
                                </Flex>
                                
                                {userInfo.affiliate && (
                                    <>
                                        <Text color="white">
                                            <strong>Affiliate Code:</strong> {userInfo.affiliate.code}
                                        </Text>
                                        <Text color="white">
                                            <strong>Rate:</strong> {(userInfo.affiliate.rate * 100).toFixed(1)}%
                                        </Text>
                                        <Text color="white">
                                            <strong>Duration:</strong> {userInfo.affiliate.duration} days
                                        </Text>
                                        
                                        <Divider borderColor="whiteAlpha.300" />
                                        
                                        <Stat>
                                            <StatLabel color="whiteAlpha.700">Total Referrals</StatLabel>
                                            <StatNumber color="white">{referrals?.length || 0}</StatNumber>
                                        </Stat>
                                        
                                        <Stat>
                                            <StatLabel color="whiteAlpha.700">Total Earnings</StatLabel>
                                            <StatNumber color="white">{formatAmount(getTotalEarnings())}</StatNumber>
                                        </Stat>
                                    </>
                                )}
                            </VStack>

                            {/* Add Referral Section */}
                            {userInfo.affiliate && isAdmin && (
                                <>
                                    <Divider borderColor="whiteAlpha.300" />
                                    <Text fontSize="lg" fontWeight="semibold" color="purple.200">
                                        Add New Referral
                                    </Text>
                                    
                                    <FormControl>
                                        <FormLabel color="white">User ID to Add as Referral</FormLabel>
                                        <Input
                                            placeholder="Enter User ID"
                                            value={newReferralUserId}
                                            onChange={(e) => setNewReferralUserId(e.target.value)}
                                            color="white"
                                            bg="whiteAlpha.100"
                                        />
                                    </FormControl>
                                    
                                    <Button 
                                        colorScheme="green" 
                                        onClick={handleAddReferral}
                                        isLoading={isAddingReferral}
                                        loadingText="Adding..."
                                        alignSelf="flex-end"
                                    >
                                        Add Referral
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </VStack>

                    {/* Referrals list */}
                    <VStack w={isPortrait ? "100%" : "50%"} spacing="1.5rem" align="start">
                        {userInfo?.affiliate && (
                            <Card
                                w="100%"
                                bg="rgb(15, 15, 15, 0.9)"
                                borderRadius="16px"
                                border="0.1rem solid"
                                borderColor="purple.400"
                            >
                                <CardHeader>
                                    <Heading size="md" color="white">
                                        Referrals ({referrals?.length || 0})
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    {referrals && referrals.length > 0 ? (
                                        <Box overflowX="auto" maxH="600px" overflowY="auto">
                                            <Table size="sm" variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        <Th color="whiteAlpha.700">Username</Th>
                                                        <Th color="whiteAlpha.700">User ID</Th>
                                                        <Th color="whiteAlpha.700">Earnings</Th>
                                                        <Th color="whiteAlpha.700">Status</Th>
                                                        <Th color="whiteAlpha.700">Expires</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {referrals.map((referral) => (
                                                        <Tr key={referral._id}>
                                                            <Td color="white">
                                                                {getUsernameById(referral.referredUserId)}
                                                            </Td>
                                                            <Td color="white">
                                                                <HStack>
                                                                    <Text fontSize="sm">
                                                                        {truncateId(referral.referredUserId)}
                                                                    </Text>
                                                                    <Tooltip label="Copy User ID">
                                                                        <IconButton
                                                                            icon={<CopyIcon />}
                                                                            size="xs"
                                                                            variant="ghost"
                                                                            color="white"
                                                                            onClick={() => copyToClipboard(referral.referredUserId)}
                                                                            aria-label="Copy User ID"
                                                                        />
                                                                    </Tooltip>
                                                                </HStack>
                                                            </Td>
                                                            <Td color="white">
                                                                {formatAmount(referral.amountEarned)}
                                                            </Td>
                                                            <Td>
                                                                <Badge 
                                                                    colorScheme={isExpired(referral.expiresAt) ? "red" : "green"}
                                                                    size="sm"
                                                                >
                                                                    {isExpired(referral.expiresAt) ? "Expired" : "Active"}
                                                                </Badge>
                                                            </Td>
                                                            <Td color="whiteAlpha.700" fontSize="sm">
                                                                {formatDate(referral.expiresAt)}
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    ) : (
                                        <Text color="whiteAlpha.600" textAlign="center" py="2rem">
                                            No referrals found
                                        </Text>
                                    )}
                                </CardBody>
                            </Card>
                        )}
                        
                        {userInfo && !userInfo.affiliate && (
                            <Card
                                w="100%"
                                bg="rgb(15, 15, 15, 0.9)"
                                borderRadius="16px"
                                border="0.1rem solid"
                                borderColor="red.400"
                            >
                                <CardBody>
                                    <Text color="red.300" textAlign="center" py="2rem">
                                        This user is not an affiliate and has no referrals.
                                    </Text>
                                </CardBody>
                            </Card>
                        )}
                    </VStack>
                </Flex>
            )}

            {/* All Affiliates Table */}
            <Box w="100%">
                <Heading size="md" mb="1rem" color="white">Affiliates</Heading>
                <Box
                    w="100%"
                    p="1.5rem"
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                >
                    {allAffiliates === undefined ? (
                        <Spinner color="white" />
                    ) : allAffiliates.length === 0 ? (
                        <Text color="white">No affiliates found</Text>
                    ) : (
                        <Box overflowX="auto" maxH="400px" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">Username</Th>
                                        <Th color="purple.100" fontWeight="bold">Code</Th>
                                        <Th color="purple.100" fontWeight="bold">Rate</Th>
                                        <Th color="purple.100" fontWeight="bold">Total Referrals</Th>
                                        <Th color="purple.100" fontWeight="bold">Active Referrals</Th>
                                        <Th color="purple.100" fontWeight="bold">Total Earnings</Th>
                                        <Th color="purple.100" fontWeight="bold">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {allAffiliates.map((affiliate) => (
                                        <Tr key={affiliate.userId}>
                                            <Td color="white">
                                                <Link href={`/profile/${affiliate.userId}`} target="_blank" passHref>
                                                    <Text as="span" sx={usernameLinkStyle}>
                                                        {affiliate.username}
                                                    </Text>
                                                </Link>
                                            </Td>
                                            <Td color="white">
                                                <HStack spacing="2">
                                                    <Text>{affiliate.affiliateCode}</Text>
                                                    <Tooltip label="Copy Affiliate Code">
                                                        <IconButton
                                                            icon={<CopyIcon />}
                                                            size="xs"
                                                            variant="ghost"
                                                            color="white"
                                                            onClick={() => copyToClipboard(affiliate.affiliateCode)}
                                                            aria-label="Copy Affiliate Code"
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
                                                {(affiliate.rate * 100).toFixed(1)}%
                                            </Td>
                                            <Td color="white" textAlign="center">
                                                {affiliate.totalReferrals}
                                            </Td>
                                            <Td color="white" textAlign="center">
                                                {affiliate.activeReferrals}
                                            </Td>
                                            <Td color="white" textAlign="right" fontWeight="bold">
                                                {formatAmount(affiliate.totalEarnings)}
                                            </Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <Tooltip label="Search This Affiliate">
                                                        <IconButton
                                                            icon={<MagnifyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => {
                                                                setUserId(affiliate.userId);
                                                                setUserIdToSearch(affiliate.userId as Id<'users'>);
                                                            }}
                                                            aria-label="Search This Affiliate"
                                                        />
                                                    </Tooltip>
                                                    <Tooltip label="Copy User ID">
                                                        <IconButton
                                                            icon={<CopyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => copyToClipboard(affiliate.userId)}
                                                            aria-label="Copy User ID"
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Referrals by Month Chart */}
            <Box w="100%">
                <Heading size="md" mb="1rem" color="white">Referrals by Month</Heading>
                <Box
                    w={isPortrait ? "100%" : "50%"}
                    p="1.5rem"
                    bg="brand.gray60"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                >
                    {referralsByMonth === undefined ? (
                        <Spinner color="white" />
                    ) : (
                        <Box overflowX="auto" maxH="400px" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">Month</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">New Referrals</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = i + 1;
                                        const count = referralsByMonth[month] || 0;
                                        
                                        return (
                                            <Tr key={month}>
                                                <Td color="white">
                                                    {new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'long' })}
                                                </Td>
                                                <Td color="white" textAlign="right" fontWeight="bold">
                                                    {count}
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>
        </VStack>
    );
};

export default Affiliates; 
