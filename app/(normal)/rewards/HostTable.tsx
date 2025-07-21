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
    useToast,
    Tooltip,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { formatMicroDollars } from '../../../components/utils/formatMoney';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon } from '@chakra-ui/icons';
import { Id } from '../../../../../packages/convex/convex/_generated/dataModel';

interface HostTableProps {
    userId: Id<"users">;
    onGamesCountChange?: (count: number) => void;
}

export const HostTable = ({ userId, onGamesCountChange }: HostTableProps) => {
    const hostRewards = useQuery(api.tasks.getHostRewards, {
        userId
    });
    const toast = useToast();

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    
    const totalPages = hostRewards ? Math.ceil(hostRewards.length / itemsPerPage) : 0;
    const paginatedRewards = hostRewards ? hostRewards.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) : [];
    
    // Notify parent component of games count
    if (onGamesCountChange) {
        onGamesCountChange(hostRewards?.length || 0);
    }
        
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

    const truncateGameId = (gameId: string) => {
        return `${gameId.slice(0, 4)}...${gameId.slice(-4)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Game ID copied to clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
        });
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
                    Games Hosted
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
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none" w="30%">Game ID</Th>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none" textAlign="right">Amount</Th>
                                <Th color="purple.200" fontWeight="bold" borderBottom="none" borderColor="gray.600" borderRight="none" textAlign="right">Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedRewards.map((reward) => (
                                <Tr key={`${reward.gameId}-${reward.date}`}>
                                    <Td color="white" borderBottom="none" fontSize="0.8rem">
                                        <HStack spacing="0.5rem" alignItems="center" justifyContent="space-between">
                                            <Text fontSize="0.8rem">{truncateGameId(reward.gameId)}</Text>
                                            <Tooltip label="Copy Game ID">
                                                <IconButton
                                                    icon={<CopyIcon />}
                                                    size="xs"
                                                    variant="ghost"
                                                    color="white"
                                                    onClick={() => copyToClipboard(reward.gameId)}
                                                    aria-label="Copy Game ID"
                                                    _hover={{ bg: "whiteAlpha.200" }}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </Td>
                                    <Td color="white" borderBottom="none" textAlign="right" fontSize="0.8rem">
                                        <HStack spacing="0.25rem" justifyContent="flex-end">
                                            <Text fontWeight="bold" fontSize="0.8rem">{formatMicroDollars(Number(reward.amount))}</Text>
                                            <Image  
                                                src="/GinzaCoin.png"
                                                w="14px"
                                                h="14px"
                                                rounded="full"
                                            />
                                        </HStack>
                                    </Td>
                                    <Td color="gray.300" borderBottom="none" textAlign="right" fontSize="0.75rem">
                                        {new Date(reward.date).toLocaleDateString()}
                                    </Td>
                                </Tr>
                            ))}
                            {(!hostRewards || hostRewards.length === 0) && (
                                <Tr>
                                    <Td colSpan={3} textAlign="center" color="white" borderBottom="none">No host rewards found</Td>
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
                            bg: "gray.700"
                        }}
                        _hover={currentPage === 0 || totalPages <= 1 ? {} : {}}
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
                            bg: "gray.700"
                        }}
                        _hover={currentPage >= totalPages - 1 || totalPages <= 1 ? {} : {}}
                    />
                </HStack>
            </VStack>
        </VStack>
    );
};

export default HostTable; 