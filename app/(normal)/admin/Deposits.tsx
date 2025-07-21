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
    useBreakpointValue,
} from '@chakra-ui/react';
import { useQuery } from "convex/react";
import { api } from '../../../../../packages/convex/convex/_generated/api';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useState } from 'react';

export const Deposits = () => {
    const depositsWithUsers = useQuery(api.deposits.batchGetDepositsWithUsers);
    const toast = useToast();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });
    
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

    const formatAmount = (amount: string) => {
        const value = parseFloat(amount) / 1000000;
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    const getStatusColor = (status: string) => {
        if (status === 'PENDING') return 'yellow.300';
        if (status === 'REQUIRES_MANUAL_RECONCILIATION') return 'red.400';
        if (status === 'CONFIRMED' || status === 'FLUSHED') return 'green.400';
        return 'white';
    };

    const formatStatus = (status: string) => {
        if (status === 'REQUIRES_MANUAL_RECONCILIATION') return 'REQ MANUAL';
        return status;
    };

    const usernameLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        _hover: {
            textDecoration: 'underline',
        }
    };

    // Calculate pagination data
    const totalPages = depositsWithUsers ? Math.ceil(depositsWithUsers.length / itemsPerPage) : 0;
    const paginatedDepositsWithUsers = depositsWithUsers 
        ? depositsWithUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
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
        <Box w="100%">
            <Heading size="md" mb="1rem" color="white">Deposits (100 most recent)</Heading>
            <Box
                w="100%"
                p="1.5rem"
                bg="brand.gray60"
                borderRadius="16px"
                border="0.1rem solid"
                borderColor="purple.400"
            >
                {depositsWithUsers === undefined ? (
                    <Spinner />
                ) : depositsWithUsers.length === 0 ? (
                    <Text color="white">No deposits found</Text>
                ) : (
                    <Flex direction="column" w="100%" h="500px" position="relative">
                        <Box overflowX="auto" w="100%" flex="1" overflowY="auto">
                            <Table variant="unstyled" size="sm" color="white">
                                <Thead>
                                    <Tr>
                                        <Th color="purple.100" fontWeight="bold">ID</Th>
                                        <Th color="purple.100" fontWeight="bold">User</Th>
                                        <Th color="purple.100" fontWeight="bold" textAlign="right">Amount</Th>
                                        <Th color="purple.100" fontWeight="bold">Status</Th>
                                        <Th color="purple.100" fontWeight="bold">Date</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedDepositsWithUsers.map(({ deposit, user }) => (
                                        <Tr key={deposit._id}>
                                            <Td color="gray.300">
                                                <HStack spacing="2" justifyContent="space-between">
                                                    {!isPortrait && <Text>{truncateId(deposit._id)}</Text>}
                                                    <Tooltip label="Copy full ID">
                                                        <IconButton
                                                            aria-label="Copy ID"
                                                            icon={<CopyIcon color="white" />}
                                                            size="xs"
                                                            variant="solid"
                                                            bg="purple.500"
                                                            _hover={{ bg: "purple.600" }}
                                                            onClick={() => copyToClipboard(deposit._id)}
                                                        />
                                                    </Tooltip>
                                                </HStack>
                                            </Td>
                                            <Td color="white">
                                                <Link 
                                                    href={`/profile/${deposit.userId}`}
                                                    target="_blank"
                                                    passHref
                                                >
                                                    <Text
                                                        as="span"
                                                        sx={usernameLinkStyle}
                                                    >
                                                        {user ? user.username : truncateId(deposit.userId)}
                                                    </Text>
                                                </Link>
                                            </Td>
                                            <Td color="white">
                                                <Text textAlign="right" fontWeight="bold">{formatAmount(deposit.amount.toString())}</Text>
                                            </Td>
                                            <Td>
                                                <Text color={getStatusColor(deposit.status)} fontWeight="bold" textAlign="left" fontSize="sm">
                                                    {formatStatus(deposit.status)}
                                                </Text>
                                            </Td>
                                            <Td color="gray.300">{formatDate(deposit._creationTime)}</Td>
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
                                Page {currentPage + 1} of {totalPages || 1}
                            </Text>
                            <IconButton
                                aria-label="Next Page"
                                icon={<ChevronRightIcon color="white" />}
                                size="sm"
                                variant="solid"
                                bg="purple.400"
                                _hover={{ bg: "purple.500" }}
                                onClick={handleNextPage}
                                isDisabled={currentPage >= totalPages - 1}
                            />
                        </HStack>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default Deposits;
