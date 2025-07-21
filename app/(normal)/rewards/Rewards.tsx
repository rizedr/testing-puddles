'use client';

import {
    VStack,
    HStack,
    Image,
    Text,
    Box,
    useToast,
    Button,
    Icon,
    useBreakpointValue,
} from '@chakra-ui/react';
import { useBalance } from '../../../components/hooks/useCurrentBalance';
import APIButton from '../../../components/Shared/APIButton';
import useViewer from '../../../components/hooks/useViewer';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { formatMicroDollars } from '../../../components/utils/formatMoney';
import { useState, useEffect } from 'react';
import { useAffiliateLink } from '../../../components/hooks/useAffiliateLink';
import { CopyIcon } from '@chakra-ui/icons';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';
import { FaCoins } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


interface RewardsProps {
    onTabChange?: (tab: 'host' | 'affiliate') => void;
    gamesHostedCount?: number;
}

export const Rewards = ({ onTabChange, gamesHostedCount: propGamesHostedCount }: RewardsProps) => {
    const { userId, user, isAuthenticated, isLoading } = useViewer();
    const router = useRouter();
    const claimRewardsMutation = useMutation(api.tasks.claimRewards);
    const claimAffiliateRewardsMutation = useMutation(api.tasks.claimAffiliateRewards);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const toast = useToast();

    const { formattedBalance: userHostRewardBalance } = useBalance(
        `${userId}_rewards`,
    );

    const { formattedBalance: userAffiliateRewardBalance } = useBalance(
        `${userId}_affiliate`,
    );

    const lifetimeHostRewards = useQuery(api.tasks.getLifetimeRewards);
    const lifetimeAffiliateRewards = useQuery(api.tasks.getLifetimeAffiliateRewards);
    
    const [activeTab, setActiveTab] = useState<'host' | 'affiliate'>('host');
    const { url, copyURL } = useAffiliateLink();
    const referrals = useQuery(api.referral.getReferrals, {
        affiliateUserId: userId as Id<"users">
    });
    
    const referredUserIds = referrals ? referrals.map(referral => referral.referredUserId) : [];
    const referredUsers = useQuery(api.users.batchGetUsers, {
        userIds: referredUserIds
    });

    // Get current user's affiliate information
    const currentUser = useQuery(api.users.getUserById, {
        userId: userId as Id<"users">
    });

    // Use games hosted count from props or local state
    const gamesHostedCount = propGamesHostedCount || 0;

    const onSuccess = () => {
        toast({
            title: 'Successfully claimed rewards',
            status: 'success',
            duration: 2000,
        });
    };

    const onError = (error: any) => {
        console.error('Error claiming rewards: ', error);
        toast({
            title: 'Unable to claim rewards. Try again later.',
            status: 'error',
            duration: 2000,
        });
    };

    // Redirect unauthenticated users to landing page
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('openSignIn', 'true');
            }
            router.replace('/');
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading state while authentication is being determined
    if (isLoading) {
        return null;
    }

    // Return null if user is not authenticated (while redirect is happening)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <VStack
            maxW="520px"
            align="center"
            w="100%"
            h={isPortrait ? "auto" : "100%"}
            mx="auto"
            position="relative"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(12, 14, 24)"
            borderRadius="16px"
            border="0.3px solid rgb(40, 39, 44)"
            boxShadow="0 0 1.5rem rgba(128, 90, 213, 0.3)"
        >
            <Box w="100%" display="flex" justifyContent="center" mt="0.5rem">
                <Image
                    src="/logos/Ginza Gaming_Logo System_Secondary_White.png"
                    alt="Ginza Logo"
                    width="auto"
                    height="60px"
                />
            </Box>
            <VStack
                w="100%"
                px="1rem"
                pb="1rem"
                spacing="1.5rem"
                align="center"
            >
                {user?.affiliate && (
                    <HStack spacing={2} p={1}>
                        <Button
                            variant={activeTab === 'host' ? 'rewardsActiveButton' : 'rewardsInactiveButton'}
                            borderRadius="12px"
                            onClick={() => {
                                setActiveTab('host');
                                onTabChange?.('host');
                            }}
                            flex={1}
                        >
                            Host
                        </Button>
                        <Button
                            variant={activeTab === 'affiliate' ? 'rewardsActiveButton' : 'rewardsInactiveButton'}
                            borderRadius="12px"
                            onClick={() => {
                                setActiveTab('affiliate');
                                onTabChange?.('affiliate');
                            }}
                            flex={1}
                        >
                            Affiliate
                        </Button>
                    </HStack>
                )}

                {activeTab === 'host' ? (
                    <VStack spacing="1rem" w="100%" align="center" minW="400px">
                        <Text
                            textAlign="center"
                            color="brand.textWhite"
                            fontSize="0.9rem"
                            mb="-0.5rem"
                        >
                            Host games or invite your friends to earn rewards!
                        </Text>
                        <HStack
                            bg="brand.gray60"
                            spacing="0.5rem"
                            w="100%"
                            height="90px"
                            p="1rem"
                            borderRadius="16px"
                            border="0.1rem solid"
                            borderColor="purple.400"
                            alignItems="stretch"
                        >
                            <VStack
                                py="1.5rem"
                                px="1rem"
                                spacing="0.25rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Games Hosted
                                </Text>
                                <Text fontSize="1rem" fontWeight="700">
                                    {gamesHostedCount}
                                </Text>
                            </VStack>
                            <VStack
                                py="1.5rem"
                                px="1rem"
                                spacing="0.25rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Lifetime Rewards
                                </Text>
                                <HStack>
                                    <Image
                                        src="/GinzaCoin.png"
                                        w="18px"
                                        h="18px"
                                        rounded="full"
                                    />
                                    <Text fontWeight="700" fontSize="1rem">
                                        {formatMicroDollars(
                                            Number(lifetimeHostRewards),
                                        )}
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>

                        <Text
                            fontSize="1.2rem"
                            mt="1rem"
                            mb="-0.5rem"
                            fontWeight="700"
                            textAlign="center"
                            w="100%"
                        >
                            Claimable Rewards
                        </Text>
                        <HStack
                            p="1rem"
                            borderRadius="1rem"
                            border="0.1rem solid"
                            borderColor="purple.400"
                            w="100%"
                            justifyContent="space-between"
                            alignItems="center"
                            bg="brand.gray60"
                        >
                            <HStack spacing="0.5rem" alignItems="center">
                                <Image
                                    src="/GinzaCoin.png"
                                    w="22px"
                                    h="22px"
                                    rounded="full"
                                />
                                <Text fontWeight="700" fontSize="1rem">
                                    {userHostRewardBalance}
                                </Text>
                            </HStack>
                            <APIButton
                                endpoint={claimRewardsMutation}
                                onSuccess={onSuccess}
                                onError={onError}
                                disabled={Number(userHostRewardBalance) === 0}
                                variant="walletButton"
                            >
                                <HStack spacing="0.5rem">
                                    <Icon 
                                        as={FaCoins} 
                                        color={Number(userHostRewardBalance) === 0 ? "gray.400" : "brand.accentWhite"} 
                                        w="14px" 
                                        h="14px" 
                                    />
                                    <Text color={Number(userHostRewardBalance) === 0 ? "gray.400" : "brand.accentWhite"}>
                                        Claim
                                    </Text>
                                </HStack>
                            </APIButton>
                        </HStack>
                    </VStack>
                ) : (
                    <VStack spacing="1rem" w="100%" align="center" minW="400px">
                        <Text
                            textAlign="center"
                            color="brand.textWhite"
                            fontSize="0.9rem"
                            mb="-0.5rem"
                        >
                            New users must sign up via your affiliate link below:
                        </Text>
                        <HStack
                            spacing=".5rem"
                            w="100%"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text
                                border="0.1px solid"
                                borderColor="purple.400"
                                borderRadius="0.5rem"
                                bg="#121212"
                                paddingX="1.5rem"
                                paddingY="0.8rem"
                                textColor="brand.white70"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textAlign="center"
                                h="3.1rem"
                            >
                                {url}
                            </Text>
                            <Button
                                variant="walletButton"
                                h="3rem"
                                onClick={copyURL}
                                fontWeight="bold"
                            >
                                <CopyIcon color="white" />
                            </Button>
                        </HStack>
                        
                        <HStack
                            bg="brand.gray60"
                            spacing="0.5rem"
                            w="100%"
                            height="70px"
                            p="0.75rem"
                            borderRadius="16px"
                            border="0.1rem solid"
                            borderColor="purple.400"
                            alignItems="stretch"
                        >
                            <VStack
                                py="1rem"
                                px="1rem"
                                spacing="0.2rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Affiliate Rate
                                </Text>
                                <Text fontSize="1rem" fontWeight="700">
                                    {currentUser?.affiliate ? `${(currentUser.affiliate.rate * 100).toFixed(1)}%` : '0%'}
                                </Text>
                            </VStack>
                            <VStack
                                py="1rem"
                                px="1rem"
                                spacing="0.2rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Referral Duration
                                </Text>
                                <Text fontSize="1rem" fontWeight="700">
                                    {currentUser?.affiliate ? `${currentUser.affiliate.duration} Days` : '0 Days'}
                                </Text>
                            </VStack>
                        </HStack>
                        <HStack
                            bg="brand.gray60"
                            spacing="0.5rem"
                            w="100%"
                            height="70px"
                            p="0.75rem"
                            borderRadius="16px"
                            border="0.1rem solid"
                            borderColor="purple.400"
                            alignItems="stretch"
                        >
                            <VStack
                                py="1.25rem"
                                px="1rem"
                                spacing="0.25rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Players Referred
                                </Text>
                                <Text fontSize="1rem" fontWeight="700">
                                    {referredUsers?.length}
                                </Text>
                            </VStack>
                            <VStack
                                py="1.25rem"
                                px="1rem"
                                spacing="0.25rem"
                                flex="1"
                                justify="center"
                            >
                                <Text fontSize="0.9rem" color="gray.400">
                                    Affiliate Rewards
                                </Text>
                                <HStack>
                                    <Image
                                        src="/GinzaCoin.png"
                                        w="18px"
                                        h="18px"
                                        rounded="full"
                                    />
                                    <Text fontWeight="700" fontSize="1rem">
                                        {formatMicroDollars(
                                            Number(lifetimeAffiliateRewards),
                                        )}
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>

                        <Text
                            fontSize="1.1rem"
                            mt="0.25rem"
                            mb="-0.5rem"
                            fontWeight="700"
                            textAlign="center"
                            w="100%"
                        >
                            Claimable Rewards
                        </Text>
                        <HStack
                            p="1rem"
                            borderRadius="1rem"
                            border="0.1rem solid"
                            borderColor="purple.400"
                            w="100%"
                            justifyContent="space-between"
                            alignItems="center"
                            bg="brand.gray60"
                        >
                            <HStack spacing="0.5rem" alignItems="center">
                                <Image
                                    src="/GinzaCoin.png"
                                    w="22px"
                                    h="22px"
                                    rounded="full"
                                />
                                <Text fontWeight="700" fontSize="1rem">
                                    {userAffiliateRewardBalance}
                                </Text>
                            </HStack>
                            <APIButton
                                endpoint={claimAffiliateRewardsMutation}
                                onSuccess={onSuccess}
                                onError={onError}
                                disabled={Number(userAffiliateRewardBalance) === 0}
                                variant="walletButton"
                            >
                                <HStack spacing="0.5rem">
                                    <Icon 
                                        as={FaCoins} 
                                        color={Number(userAffiliateRewardBalance) === 0 ? "gray.400" : "brand.accentWhite"} 
                                        w="14px" 
                                        h="14px" 
                                    />
                                    <Text color={Number(userAffiliateRewardBalance) === 0 ? "gray.400" : "brand.accentWhite"}>
                                        Claim
                                    </Text>
                                </HStack>
                            </APIButton>
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
};

export default Rewards;
