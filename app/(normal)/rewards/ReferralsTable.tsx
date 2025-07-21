'use client';

import {
    VStack,
    HStack,
    Image,
    Text,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Badge,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { formatMicroDollars } from '../../../components/utils/formatMoney';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';

interface ReferralsTableProps {
    userId: Id<"users">;
}

export const ReferralsTable = ({ userId }: ReferralsTableProps) => {
    const referrals = useQuery(api.referral.getReferrals, {
        affiliateUserId: userId
    });
    
    const referredUserIds = referrals ? referrals.map(referral => referral.referredUserId) : [];
    const referredUsers = useQuery(api.users.batchGetUsers, {
        userIds: referredUserIds
    });

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    
    const totalPages = referrals ? Math.ceil(referrals.length / itemsPerPage) : 0;
    const paginatedReferrals = referrals 
        ? referrals.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        : [];
        
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <VStack
            maxW="500px"
            align="center"
            w="100%"
            h="100%"
            mx="auto"
            position="relative"
            background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(12, 14, 24)"
            borderRadius="16px"
            border="0.3px solid rgb(40, 39, 44)"
            boxShadow="0 0 1.5rem rgba(128, 90, 213, 0.3)"
            overflowY="auto"
            overflowX="hidden"
        >
            <Box w="100%" display="flex" justifyContent="center" mt="1rem">
                <Text
                    fontSize="1.1rem"
                    fontWeight="700"
                    textAlign="center"
                    color="brand.textWhite"
                >
                    User Referrals
                </Text>
            </Box>
            <VStack
                w="100%"
                px="1rem"
                pb="1rem"
                spacing="1rem"
                align="center"
                flex="1"
            >
                <Box
                    p="1rem"
                    borderRadius="16px"
                    border="0.1rem solid"
                    borderColor="purple.400"
                    w="100%"
                    bg="brand.gray60"
                    flex="1"
                    minH="400px"
                >
                    <Table variant="simple" size="sm" w="100%">
                        <Thead>
                            <Tr>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none">User</Th>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none" textAlign="right">Earned</Th>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none">Status</Th>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none" textAlign="right">Joined</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedReferrals.map((referral) => {
                                const isActive = Date.now() <= referral.expiresAt;
                                const referredUser = referredUsers?.find(user => user._id === referral.referredUserId);
                                return (
                                    <Tr key={referral._id}>
                                        <Td color="white" borderBottom="none" fontWeight="bold">{referredUser?.username || "Unknown"}</Td>
                                        <Td color="white" borderBottom="none" textAlign="right">
                                            <HStack spacing="0.25rem" justifyContent="flex-end">
                                                <Text fontWeight="bold">{formatMicroDollars(Number(referral.amountEarned))}</Text>
                                                <Image
                                                    src="/GinzaCoin.png"
                                                    w="14px"
                                                    h="14px"
                                                    rounded="full"
                                                />
                                            </HStack>
                                        </Td>
                                        <Td borderBottom="none">
                                            <Badge 
                                                bg={isActive ? 'green.700' : 'red.700'} 
                                                color="white"
                                                borderRadius="4px"
                                                px="1"
                                                py="0"
                                                fontSize="xs"
                                            >
                                                {isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </Badge>
                                        </Td>
                                        <Td color="gray.300" borderBottom="none" textAlign="right" fontSize="0.85rem">{new Date(referral._creationTime).toLocaleDateString()}</Td>
                                    </Tr>
                                );
                            })}
                            {(!referrals || referrals.length === 0) && (
                                <Tr>
                                    <Td colSpan={4} textAlign="center" color="white" borderBottom="none">No users found</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Box>
                
                <HStack justifyContent="center" spacing={4}>
                    <IconButton
                        aria-label="Previous Page"
                        icon={<ChevronLeftIcon color="white" />}
                        size="xs"
                        variant="walletButton"
                        h="2rem"
                        w="2rem"
                        onClick={handlePrevPage}
                        isDisabled={currentPage === 0 || totalPages <= 1}
                        _disabled={{
                            opacity: 0.3,
                            cursor: "not-allowed",
                            bg: "gray.700"
                        }}
                        _hover={currentPage === 0 || totalPages <= 1 ? {
                            opacity: 0.3,
                            cursor: "not-allowed",
                            bg: "gray.700"
                        } : {}}
                    />
                    <Text color="gray.300" fontSize="sm">
                        Page {currentPage + 1} of {totalPages || 1}
                    </Text>
                    <IconButton
                        aria-label="Next Page"
                        icon={<ChevronRightIcon color="white" />}
                        size="xs"
                        variant="walletButton"
                        h="2rem"
                        w="2rem"
                        onClick={handleNextPage}
                        isDisabled={currentPage >= totalPages - 1 || totalPages <= 1}
                        _disabled={{
                            opacity: 0.3,
                            cursor: "not-allowed",
                            bg: "gray.700"
                        }}
                        _hover={currentPage >= totalPages - 1 || totalPages <= 1 ? {
                            opacity: 0.3,
                            cursor: "not-allowed",
                            bg: "gray.700"
                        } : {}}
                    />
                </HStack>
            </VStack>
        </VStack>
    );
};

export default ReferralsTable; 